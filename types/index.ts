// ============================================
// WORDFLOW APP - TIPOS
// ============================================

// --- Usuário ---
export interface User {
  id: string;
  email: string;
  nome: string;
  whatsapp?: string;
  whatsapp_confirmado?: boolean;
  push_token?: string;
  nivel: 'basico' | 'intermediario' | 'avancado';
  objetivos: string[];
  horario_preferido: 'manha' | 'almoco' | 'tarde' | 'noite';
  slot_envio?: number;
  audio_habilitado: boolean;
  status: 'novo' | 'trial' | 'ativo' | 'pausado' | 'cancelado' | 'inativo';
  trial_inicio?: string;
  trial_fim?: string;
  onboarding_completo: boolean;
  caderno_ativo_id?: string;
  frases_por_dia: number;
  frases_enviadas_hoje: number;
  total_frases_vistas: number;
  total_frases_corretas: number;
  dias_consecutivos: number;
  tem_sessao_ativa: boolean;
  aceita_envios_automaticos: boolean;
  ultimo_envio?: string;
  ultima_interacao?: string;
  created_at: string;
  updated_at: string;
}

// --- Cadernos ---
export interface Caderno {
  id: string;
  tipo: 'padrao' | 'tematico' | 'parceiro' | 'pessoal';
  nome: string;
  descricao?: string;
  total_frases: number;
  palavras_unicas_estimadas?: number;
  icone?: string;
  cor?: string;
  professor_id?: string;
  preco?: number;
  comissao_professor?: number;
  codigo_desconto?: string;
  status: string;
  created_at: string;
}

// --- Frases ---
export interface Frase {
  id: string;
  frase: string;
  traducao: string;
  explicacao?: string;
  nivel: 'basico' | 'intermediario' | 'avancado';
  contexto?: string;
  tags?: string[];
  audio_url?: string;
  status: string;
}

// --- Sessão ---
export interface Sessao {
  id: string;
  user_id: string;
  tipo: string;
  status: 'ativa' | 'concluida' | 'abandonada' | 'expirada';
  total_frases: number;
  frases_respondidas: number;
  frase_atual: number;
  acertos: number;
  erros: number;
  iniciada_em: string;
  concluida_em?: string;
}

// --- Controle de Envios ---
export interface ControleEnvio {
  id: string;
  user_id: string;
  frase_id: string;
  sessao_id?: string;
  data_envio?: string;
  tipo_envio: string;
  periodo?: string;
  sabe?: boolean;
  data_resposta?: string;
  proxima_revisao?: string;
  nivel_aprendizado: number;
  repeticoes: number;
  estado: 'nova' | 'confirmacao' | 'aprendendo' | 'dominada' | 'manutencao';
  acertou_primeira?: boolean;
  origem?: string;
  ordem_na_sessao?: number;
  total_sessao?: number;
}

// --- API Responses ---
export interface FraseSessao {
  controle_id: string;
  frase_id: string;
  frase: string;
  nivel: string;
  tipo: string;
  ordem: number;
  audio_url?: string;
}

export interface IniciarSessaoResponse {
  success: boolean;
  sessao_id: string;
  total_frases: number;
  frases: FraseSessao[];
}

export interface FeedbackResposta {
  acertou: boolean;
  traducao: string;
  explicacao?: string;
  audio_url?: string;
}

export interface ResponderFraseResponse {
  success: boolean;
  feedback: FeedbackResposta;
  sessao: {
    frases_respondidas: number;
    total_frases: number;
    acertos: number;
    erros: number;
    concluida: boolean;
  };
  proxima_frase?: FraseSessao | null;
}

// --- Onboarding ---
export interface AvaliacaoFrase {
  frase_id: string;
  frase: string;
  nivel: string;
  conhece: boolean;
}

export interface OnboardingResult {
  nivel_detectado: 'basico' | 'intermediario' | 'avancado';
  frases_para_aprender: number;
  frases_dominadas: number;
}

// --- Auth ---
export interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  session: any;
}
