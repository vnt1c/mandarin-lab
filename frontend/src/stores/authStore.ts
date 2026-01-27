import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthState = {
  user: User | null;
  initialized: boolean;
  isLoading: boolean;
  error: string | null;

  init: () => Promise<() => void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  isLoading: false,
  error: null,

  init: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) set({ error: error.message });
    set({ user: data.session?.user ?? null, initialized: true });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      set({ user: session?.user ?? null, initialized: true });
    });

    return () => sub.subscription.unsubscribe();
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) set({ error: error.message, isLoading: false });
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    const { error } = await supabase.auth.signOut();
    if (error) set({ error: error.message, isLoading: false });
    else set({ user: null, isLoading: false, initialized: true });
  },
}));
