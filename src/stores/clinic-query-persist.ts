import type { PersistOptions, PersistStorage, StorageValue } from "zustand/middleware";
import { logger } from "@/lib/logger";
import { shareEqualData } from "@/stores/query-state";

const DATABASE_NAME = "thalia-clinic-query-cache";
const STORE_NAME = "queries";
const PREFIX = "v1";

type Scope = { userId: string; clinicId: string };

let scope: Scope | null = null;
let writable = false;
let databasePromise: Promise<IDBDatabase> | null = null;
const pendingWrites = new Map<string, Set<Promise<void>>>();
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeClinicPersist(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getReadyClinicPersistScope() {
  return writable && scope ? `${scope.userId}:${scope.clinicId}` : null;
}

function openDatabase(): Promise<IDBDatabase> {
  if (!databasePromise) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch((error) => {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise!;
}

async function readValue<T>(key: string): Promise<T | null> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
}

async function writeValue<T>(key: string, value: T): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(value, key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function deleteValue(key: string): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function scopedKey(name: string, target: Scope) {
  return `${PREFIX}:${target.userId}:${target.clinicId}:${name}`;
}

export function setClinicPersistScope(next: Scope | null) {
  scope = next;
  writable = false;
  notify();
}

export function enableClinicPersistWrites() {
  writable = true;
  notify();
}

const transientDefaults: Record<string, unknown> = {
  loading: false,
  loadingMore: false,
  error: null,
  loadMoreError: null,
  requestId: "",
};

function withoutTransientState(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutTransientState);
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Blob) return null;

  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (key === "requestedAt") continue;
    result[key] = key in transientDefaults
      ? transientDefaults[key]
      : withoutTransientState(item);
  }
  return result;
}

export function clinicPersistOptions<State>(
  name: string,
  keys: readonly (keyof State)[],
): PersistOptions<State, Partial<State>> {
  let previousSnapshot: Partial<State> | null = null;
  let writtenKey: string | null = null;
  let writtenSnapshot: Partial<State> | null = null;
  const storage: PersistStorage<Partial<State>> = {
    getItem: async (itemName) => {
      const target = scope;
      if (!target || typeof indexedDB === "undefined") return null;
      try {
        return await readValue<StorageValue<Partial<State>>>(scopedKey(itemName, target));
      } catch (cause) {
        logger.captureException(cause, { store: "clinic-query-persist", action: "read", itemName });
        return null;
      }
    },
    setItem: (itemName, value) => {
      const target = scope;
      if (!target || !writable || typeof indexedDB === "undefined") return;
      const key = scopedKey(itemName, target);
      if (writtenKey === key && writtenSnapshot === value.state) return;
      writtenKey = key;
      writtenSnapshot = value.state;
      const pending = writeValue(key, value).catch((cause) => {
        logger.captureException(cause, { store: "clinic-query-persist", action: "write", itemName });
      });
      const writes = pendingWrites.get(key) ?? new Set<Promise<void>>();
      writes.add(pending);
      pendingWrites.set(key, writes);
      void pending.then(() => {
        writes.delete(pending);
        if (writes.size === 0) pendingWrites.delete(key);
      });
      return pending;
    },
    removeItem: (itemName) => {
      const target = scope;
      if (!target || typeof indexedDB === "undefined") return;
      return deleteValue(scopedKey(itemName, target));
    },
  };

  const partialize = (state: State): Partial<State> => {
    const cached: Partial<State> = {};
    for (const key of keys) {
      cached[key] = withoutTransientState(state[key]) as State[typeof key];
    }
    previousSnapshot = previousSnapshot ? shareEqualData(previousSnapshot, cached) : cached;
    return previousSnapshot;
  };

  return { name, storage, partialize, skipHydration: true, version: 1 };
}

export async function clearPersistedUser(userId: string) {
  if (typeof indexedDB === "undefined") return;
  await Promise.all([...pendingWrites.entries()]
    .filter(([key]) => key.startsWith(`${PREFIX}:${userId}:`))
    .flatMap(([, writes]) => [...writes]));
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.openKeyCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      if (String(cursor.key).startsWith(`${PREFIX}:${userId}:`)) {
        store.delete(cursor.key);
      }
      cursor.continue();
    };
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
