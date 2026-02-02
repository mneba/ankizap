// ============================================
// WORDFLOW - CONFIGURAÇÕES
// ============================================

export const Config = {
  // Supabase
  supabaseUrl: 'https://iashlxsgjxzlquxliqab.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhc2hseHNnanh6bHF1eGxpcWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDU1MDUsImV4cCI6MjA3MDE4MTUwNX0.-aBp-OqP_T68ZpmBL_KGWZ-73q9sbACHU3i6E6IjeDc',

  // App
  appName: 'WordFlow',
  appVersion: '1.0.0',

  // Sessão
  defaultFrasesPerDay: 5,
  maxFrasesPerDay: 30,
  trialDays: 7,

  // Horários de push
  pushSchedule: {
    manha: '07:30',
    lembrete: '12:00',
    tarde: '16:00',
    noite: '20:00',
  },

  // Repetição espaçada - intervalos em dias
  spacedRepetition: {
    naoSabe: [1, 1, 1], // sempre +1 dia
    sabe: [1, 3, 7, 14, 30], // ciclo completo
    confirmacao: 7, // acertou de primeira
    manutencao: 60, // revisão de dominadas
  },

  // Detecção de nível
  levelDetection: {
    immediateThreshold: 0.9, // 90% em 20+ frases = sobe agora
    immediateMinPhrases: 20,
    gradualThreshold: 0.8, // 80% por 7 dias = sobe amanhã
    gradualDays: 7,
  },
};
