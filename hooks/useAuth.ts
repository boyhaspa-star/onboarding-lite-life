/**
 * useAuth Hook
 *
 * Bridges Supabase Auth → profile$ store → React components.
 * Handles sign-in, sign-out, session tracking, and auth state.
 *
 * Usage:
 *   const { user, isLoading, signIn, signOut } = useAuth();
 */

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/data/supabase';
import { profile$ } from '@/store/profile$';
import { app$ } from '@/store/app$';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Listen for auth state changes
  useEffect(() => {
    if (!supabase) {
      // No Supabase configured — skip auth, just mark as not loading
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        isLoading: false,
        isAuthenticated: !!session,
      });

      if (session?.user) {
        // Hydrate profile store with auth data
        profile$.id.set(session.user.id);
        profile$.email.set(session.user.email ?? '');
      }
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        isLoading: false,
        isAuthenticated: !!session,
      });

      if (session?.user) {
        profile$.id.set(session.user.id);
        profile$.email.set(session.user.email ?? '');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Auth Actions ───────────────────────────────────

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { data: null, error: new Error('Supabase not configured') };
      app$.loading.auth.set(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        return { data: null, error: error as Error };
      } finally {
        app$.loading.auth.set(false);
      }
    },
    []
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { data: null, error: new Error('Supabase not configured') };
      app$.loading.auth.set(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        return { data: null, error: error as Error };
      } finally {
        app$.loading.auth.set(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    app$.loading.auth.set(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Clear profile store on sign out
      profile$.set({
        id: '',
        email: '',
        displayName: '',
        gender: null,
        age: null,
        birthday: null,
        fitnessLevel: null,
        targetMuscleGroups: [],
        availableDays: [],
        onboardingCompleted: false,
        createdAt: null,
        updatedAt: null,
      });
    } finally {
      app$.loading.auth.set(false);
    }
  }, []);

  return {
    ...authState,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
