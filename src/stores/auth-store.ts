import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

import { captureEvent } from "@/lib/analytics";
import { uploadFile } from "@/lib/storage";
import { assertSupabaseConfigured, supabase } from "@/lib/supabase";
import { unwrapSupabase } from "@/lib/supabase-query";
import { useEmployeesStore } from "@/stores/employees-store";
import type { Employee } from "@/types/database.types";

export type UpdateProfileInput = {
  full_name: string;
  phone: string | null;
  specialty: string | null;
  color: string | null;
};

type AuthStore = {
  session: Session | null;
  profile: Employee | null;
  loading: boolean;
  updating: boolean;
  updateError: Error | null;
  uploadingAvatar: boolean;
  uploadAvatarError: Error | null;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (values: UpdateProfileInput) => Promise<Employee>;
  uploadProfileAvatar: (imageUri: string) => Promise<Employee>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: { full_name: string }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  profile: null,
  loading: true,
  updating: false,
  updateError: null,
  uploadingAvatar: false,
  uploadAvatarError: null,

  setSession: (session) => set({ session }),

  setLoading: (loading) => set({ loading }),

  refreshProfile: async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;

    if (!userId) {
      set({ profile: null });
      return;
    }

    const { data: employee, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    set({ profile: employee });
  },

  updateProfile: async (values) => {
    const userId =
      get().session?.user.id ?? (await supabase.auth.getSession()).data.session?.user.id;

    if (!userId) {
      throw new Error("No hay sesión activa");
    }

    set({ updating: true, updateError: null });

    try {
      const { data, error } = await supabase
        .from("employees")
        .update({
          full_name: values.full_name,
          phone: values.phone,
          specialty: values.specialty,
          color: values.color,
        })
        .eq("id", userId)
        .select("*")
        .single();
      const employee = unwrapSupabase(data, error) as Employee;
      await get().refreshProfile();
      await useEmployeesStore.getState().fetchEmployees();
      set({ updating: false });
      return employee;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ updating: false, updateError: error });
      throw error;
    }
  },

  uploadProfileAvatar: async (imageUri) => {
    const userId =
      get().session?.user.id ?? (await supabase.auth.getSession()).data.session?.user.id;

    if (!userId) {
      throw new Error("No hay sesión activa");
    }

    set({ uploadingAvatar: true, uploadAvatarError: null });

    try {
      const key = await uploadFile(`employees/${userId}/avatar.jpg`, imageUri, "image/jpeg");
      const { data, error } = await supabase
        .from("employees")
        .update({ avatar_url: key })
        .eq("id", userId)
        .select("*")
        .single();
      const employee = unwrapSupabase(data, error) as Employee;
      await get().refreshProfile();
      await useEmployeesStore.getState().fetchEmployees();
      set({ uploadingAvatar: false });
      return employee;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ uploadingAvatar: false, uploadAvatarError: error });
      throw error;
    }
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    captureEvent("login");
  },

  signUp: async (email, password, metadata) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });

    if (error) {
      throw error;
    }

    captureEvent("signup");
  },

  signInWithGoogle: async () => {
    assertSupabaseConfigured();

    const origin = typeof globalThis.location !== "undefined" ? globalThis.location.origin : "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/dashboard`,
      },
    });

    if (error) {
      throw error;
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    captureEvent("logout");
  },
}));
