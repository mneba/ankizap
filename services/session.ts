// ============================================
// WORDFLOW - SESSION SERVICE
// ============================================
import { supabase } from './supabase';
import type {
  Caderno,
  IniciarSessaoResponse,
  ResponderFraseResponse,
  Sessao,
} from '../types';

// --- Listar cadernos ---
export async function getCadernos(): Promise<Caderno[]> {
  const { data, error } = await supabase
    .from('cadernos')
    .select('*')
    .eq('status', 'ativo')
    .order('tipo', { ascending: true });

  if (error) throw error;
  return data as Caderno[];
}

// --- Verificar sessão ativa ---
export async function getSessaoAtiva(userId: string): Promise<Sessao | null> {
  const { data, error } = await supabase
    .from('sessoes')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'ativa')
    .order('iniciada_em', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as Sessao | null;
}

// --- Iniciar sessão via Edge Function ---
export async function iniciarSessao(userId: string): Promise<IniciarSessaoResponse> {
  const { data, error } = await supabase.functions.invoke('iniciar-sessao-app', {
    body: { user_id: userId },
  });

  if (error) throw error;
  return data as IniciarSessaoResponse;
}

// --- Responder frase via Edge Function ---
export async function responderFrase(
  userId: string,
  controleId: string,
  resposta: boolean
): Promise<ResponderFraseResponse> {
  const { data, error } = await supabase.functions.invoke('responder-frase-app', {
    body: {
      user_id: userId,
      controle_id: controleId,
      resposta,
    },
  });

  if (error) throw error;
  return data as ResponderFraseResponse;
}

// --- Buscar frases do onboarding ---
export async function buscarFrasesOnboarding(
  cadernoTipo: string = 'padrao',
  quantidade: number = 10
) {
  const { data, error } = await supabase.functions.invoke('buscar-frases-onboarding', {
    body: {
      caderno_tipo: cadernoTipo,
      nivel: 'misto',
      quantidade,
    },
  });

  if (error) throw error;
  return data;
}

// --- Processar onboarding ---
export async function processarOnboarding(
  userId: string,
  cadernoId: string,
  cadernoTipo: string,
  avaliacoes: { frase_id: string; conhece: boolean; nivel: string }[]
) {
  const { data, error } = await supabase.functions.invoke('processar-onboarding', {
    body: {
      user_id: userId,
      caderno_id: cadernoId,
      caderno_tipo: cadernoTipo,
      avaliacoes,
    },
  });

  if (error) throw error;
  return data;
}

// --- Buscar métricas ---
export async function getMetricas(userId: string, dias: number = 30) {
  const { data, error } = await supabase
    .from('metricas_diarias')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false })
    .limit(dias);

  if (error) throw error;
  return data;
}
