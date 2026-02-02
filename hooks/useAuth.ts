// ============================================
// WORDFLOW - useAuth HOOK
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as auth from '../services/auth';
import type { User, AuthState } from '../types';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isLoggedIn: false,
    user: null,
    session: null,
  });

  // Carregar sessão inicial
  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const session = await auth.getSession();
        if (session?.user && mounted) {
          const profile = await auth.getUserProfile(session.user.id);
          setState({
            isLoading: false,
            isLoggedIn: true,
            user: profile,
            session,
          });
        } else if (mounted) {
          setState({
            isLoading: false,
            isLoggedIn: false,
            user: null,
            session: null,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        if (mounted) {
          setState({
            isLoading: false,
            isLoggedIn: false,
            user: null,
            session: null,
          });
        }
      }
    }

    loadSession();

    // Listener para mudanças de auth
    const { data: subscription } = auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await auth.getUserProfile(session.user.id);
        setState({
          isLoading: false,
          isLoggedIn: true,
          user: profile,
          session,
        });
      } else if (event === 'SIGNED_OUT') {
        setState({
          isLoading: false,
          isLoggedIn: false,
          user: null,
          session: null,
        });
      }
    });

    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  // Registrar
  const register = useCallback(async (email: string, password: string, nome: string) => {
    try {
      setState(s => ({ ...s, isLoading: true }));
      await auth.signUp(email, password, nome);
      // onAuthStateChange vai atualizar o estado
    } catch (error: any) {
      setState(s => ({ ...s, isLoading: false }));
      const msg =
        error.message === 'User already registered'
          ? 'Este email já está cadastrado.'
          : error.message || 'Erro ao criar conta.';
      Alert.alert('Erro', msg);
      throw error;
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(s => ({ ...s, isLoading: true }));
      await auth.signIn(email, password);
      // onAuthStateChange vai atualizar o estado
    } catch (error: any) {
      setState(s => ({ ...s, isLoading: false }));
      const msg =
        error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos.'
          : error.message || 'Erro ao fazer login.';
      Alert.alert('Erro', msg);
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await auth.signOut();
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao sair.');
    }
  }, []);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (state.session?.user?.id) {
      const profile = await auth.getUserProfile(state.session.user.id);
      setState(s => ({ ...s, user: profile }));
    }
  }, [state.session]);

  return {
    ...state,
    register,
    login,
    logout,
    refreshProfile,
  };
}
