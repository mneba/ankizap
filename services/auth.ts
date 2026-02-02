// ============================================
// WORDFLOW - AUTH SERVICE
// ============================================
import { supabase } from './supabase';
import type { User } from '../types';

// --- Registrar novo usuário ---
export async function signUp(email: string, password: string, nome: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome },
    },
  });

  if (error) throw error;
  return data;
}

// --- Login ---
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// --- Logout ---
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// --- Buscar sessão atual ---
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// --- Buscar perfil do usuário ---
export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil:', error.message);
    return null;
  }

  return data as User;
}

// --- Atualizar perfil ---
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

// --- Listener de mudanças de auth ---
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
