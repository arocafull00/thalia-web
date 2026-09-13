"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * Cuenta atrás entre reenvíos de un correo.
 *
 * Es **feedback, no protección**: quien quiera saltárselo sólo tiene que borrar
 * el almacenamiento o abrir una ventana privada. El límite de verdad lo aplica
 * Supabase Auth en el servidor (#107). Esto sirve para que el usuario sepa que
 * tiene que esperar, en vez de pulsar y que no pase nada visible.
 *
 * Se guarda en `localStorage` y no en memoria porque con memoria basta recargar
 * para volver a ver el botón activo — y entonces Supabase rechaza el envío
 * igualmente, que es peor: parece que la aplicación ha mentido.
 */
const COOLDOWN_SECONDS = 60;

function storageKey(scope: string) {
  return `thalia-resend-cooldown:${scope}`;
}

/*
 * El momento del último envío se lee con `useSyncExternalStore` y no en un
 * efecto: `localStorage` no existe al renderizar en servidor, y copiarlo a
 * estado desde un efecto provoca un render en cascada. Aquí el servidor
 * devuelve 0 y el cliente el valor real, sin discrepancia de hidratación.
 *
 * Se lee del almacenamiento en cada llamada, sin caché intermedia: el valor es
 * un número, así que dos lecturas seguidas devuelven algo idéntico y
 * `useSyncExternalStore` no entra en bucle. Una caché en el módulo sobreviviría
 * a un desmontaje y escondería justo lo que aquí importa, que es que la espera
 * persista al recargar la página.
 */
const listeners = new Set<() => void>();

function readLastSentAt(scope: string): number {
  try {
    const raw = window.localStorage.getItem(storageKey(scope));
    const parsed = raw ? Number.parseInt(raw, 10) : 0;

    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    // Modo privado o almacenamiento bloqueado: sin cuenta atrás, pero la
    // pantalla sigue funcionando.
    return 0;
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);

  return () => {
    listeners.delete(onChange);
  };
}

function remainingSeconds(lastSentAt: number, now: number): number {
  if (!lastSentAt) {
    return 0;
  }

  return Math.max(0, COOLDOWN_SECONDS - Math.floor((now - lastSentAt) / 1000));
}

/**
 * @param scope identifica al usuario, para que la espera no se comparta entre
 *              cuentas que hayan usado el mismo navegador
 */
export function useResendCooldown(scope: string | null) {
  const lastSentAt = useSyncExternalStore(
    subscribe,
    () => (scope ? readLastSentAt(scope) : 0),
    () => 0,
  );

  // Solo sirve para forzar un repintado cada segundo: el valor que se muestra
  // se calcula en el render, no se guarda.
  const [now, setNow] = useState(() => Date.now());
  const secondsLeft = remainingSeconds(lastSentAt, now);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const id = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(id);
  }, [secondsLeft]);

  const start = useCallback(() => {
    if (!scope) {
      return;
    }

    const ahora = Date.now();

    try {
      window.localStorage.setItem(storageKey(scope), String(ahora));
    } catch {
      // Sin almacenamiento la cuenta atrás sólo dura lo que dure la pestaña.
    }

    setNow(ahora);
    listeners.forEach((listener) => listener());
  }, [scope]);

  return { secondsLeft, isCoolingDown: secondsLeft > 0, start };
}
