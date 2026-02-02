// ============================================
// WORDFLOW - HOME (SESSÃO DE FRASES)
// Tela principal do app
// ============================================
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuthContext } from '../_layout';
import { iniciarSessao, responderFrase, getSessaoAtiva } from '../../services/session';
import type { FraseSessao, FeedbackResposta } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

type ScreenState = 'loading' | 'ready' | 'phrase' | 'feedback' | 'summary' | 'error';

export default function HomeScreen() {
  const { user, refreshProfile } = useAuthContext();

  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  const [frases, setFrases] = useState<FraseSessao[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackResposta | null>(null);
  const [sessionStats, setSessionStats] = useState({ acertos: 0, erros: 0, total: 0 });
  const [answering, setAnswering] = useState(false);

  // Carregar sessão quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        checkSession();
      }
    }, [user?.id])
  );

  async function checkSession() {
    try {
      setScreenState('loading');

      // Verificar se tem sessão ativa
      const sessaoAtiva = await getSessaoAtiva(user!.id);

      if (sessaoAtiva) {
        // TODO: retomar sessão existente
        // Por agora, mostra tela "ready" para iniciar nova
        setScreenState('ready');
      } else {
        setScreenState('ready');
      }
    } catch (err) {
      console.error('Erro ao verificar sessão:', err);
      setScreenState('ready');
    }
  }

  async function startSession() {
    if (!user?.id) return;

    try {
      setScreenState('loading');
      const data = await iniciarSessao(user.id);

      if (data.success && data.frases.length > 0) {
        setSessaoId(data.sessao_id);
        setFrases(data.frases);
        setCurrentIndex(0);
        setSessionStats({ acertos: 0, erros: 0, total: data.frases.length });
        setScreenState('phrase');
      } else {
        setScreenState('ready');
      }
    } catch (err) {
      console.error('Erro ao iniciar sessão:', err);
      setScreenState('error');
    }
  }

  async function handleAnswer(sabe: boolean) {
    if (!user?.id || answering) return;

    const currentFrase = frases[currentIndex];
    if (!currentFrase) return;

    setAnswering(true);
    try {
      const data = await responderFrase(user.id, currentFrase.controle_id, sabe);

      setFeedback(data.feedback);
      setSessionStats(prev => ({
        ...prev,
        acertos: prev.acertos + (sabe ? 1 : 0),
        erros: prev.erros + (sabe ? 0 : 1),
      }));
      setScreenState('feedback');
    } catch (err) {
      console.error('Erro ao responder:', err);
      // Feedback local de fallback
      setFeedback({
        acertou: sabe,
        traducao: 'Erro ao processar. Tente novamente.',
        explicacao: undefined,
      });
      setScreenState('feedback');
    } finally {
      setAnswering(false);
    }
  }

  function nextPhrase() {
    const nextIdx = currentIndex + 1;
    if (nextIdx < frases.length) {
      setCurrentIndex(nextIdx);
      setFeedback(null);
      setScreenState('phrase');
    } else {
      // Sessão concluída
      setScreenState('summary');
      refreshProfile();
    }
  }

  // ==================
  // RENDERS
  // ==================

  // LOADING
  if (screenState === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
        <Text style={styles.loadingText}>Preparando sua sessão...</Text>
      </View>
    );
  }

  // READY - Aguardando iniciar
  if (screenState === 'ready') {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.readyContent}>
          <Text style={styles.readyEmoji}>⚡</Text>
          <Text style={styles.readyTitle}>
            Olá, {user?.nome || 'estudante'}!
          </Text>
          <Text style={styles.readySubtitle}>Pronto para destravar seu inglês?</Text>

          {/* Stats rápidos */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{user?.total_frases_vistas || 0}</Text>
              <Text style={styles.quickStatLabel}>Praticadas</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>{user?.dias_consecutivos || 0}</Text>
              <Text style={styles.quickStatLabel}>Dias 🔥</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStatItem}>
              <Text style={styles.quickStatValue}>
                {user?.total_frases_vistas
                  ? Math.round(
                      ((user.total_frases_corretas || 0) / user.total_frases_vistas) * 100
                    )
                  : 0}
                %
              </Text>
              <Text style={styles.quickStatLabel}>Acerto</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={startSession}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Iniciar sessão</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // PHRASE - Mostrando frase
  if (screenState === 'phrase') {
    const frase = frases[currentIndex];
    return (
      <View style={styles.sessionContainer}>
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex) / frases.length) * 100}%` },
            ]}
          />
        </View>

        <View style={styles.sessionHeader}>
          <Text style={styles.sessionCounter}>
            {currentIndex + 1} / {frases.length}
          </Text>
          <Text style={styles.sessionType}>
            {frase.tipo === 'revisao' ? '🔄 Revisão' : '🆕 Nova'}
          </Text>
        </View>

        {/* Phrase Card */}
        <View style={styles.phraseCard}>
          <Text style={styles.phraseText}>{frase.frase}</Text>
          <Text style={styles.phraseHint}>Você sabe o significado?</Text>
        </View>

        {/* Answer Buttons */}
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={[styles.answerBtn, styles.answerBtnNo]}
            onPress={() => handleAnswer(false)}
            disabled={answering}
            activeOpacity={0.8}
          >
            {answering ? (
              <ActivityIndicator color={Colors.accent.red} />
            ) : (
              <>
                <Text style={styles.answerBtnEmoji}>🤔</Text>
                <Text style={[styles.answerBtnText, { color: Colors.accent.red }]}>
                  Não sei
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.answerBtn, styles.answerBtnYes]}
            onPress={() => handleAnswer(true)}
            disabled={answering}
            activeOpacity={0.8}
          >
            {answering ? (
              <ActivityIndicator color={Colors.accent.green} />
            ) : (
              <>
                <Text style={styles.answerBtnEmoji}>💪</Text>
                <Text style={[styles.answerBtnText, { color: Colors.accent.green }]}>
                  Sei!
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // FEEDBACK - Mostrando tradução/explicação
  if (screenState === 'feedback' && feedback) {
    const frase = frases[currentIndex];
    return (
      <View style={styles.sessionContainer}>
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / frases.length) * 100}%` },
            ]}
          />
        </View>

        <ScrollView contentContainerStyle={styles.feedbackContent}>
          {/* Status */}
          <View
            style={[
              styles.feedbackBadge,
              feedback.acertou ? styles.feedbackBadgeCorrect : styles.feedbackBadgeWrong,
            ]}
          >
            <Text style={styles.feedbackBadgeText}>
              {feedback.acertou ? '✅ Isso!' : '📝 Vamos aprender!'}
            </Text>
          </View>

          {/* Phrase */}
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackFlag}>🇺🇸</Text>
            <Text style={styles.feedbackPhrase}>{frase.frase}</Text>

            <View style={styles.feedbackDivider} />

            <Text style={styles.feedbackFlag}>🇧🇷</Text>
            <Text style={styles.feedbackTranslation}>{feedback.traducao}</Text>

            {feedback.explicacao && (
              <View style={styles.feedbackExplanation}>
                <Text style={styles.feedbackExplanationLabel}>💡 Dica</Text>
                <Text style={styles.feedbackExplanationText}>
                  {feedback.explicacao}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextPhrase}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex + 1 < frases.length ? 'Próxima frase →' : 'Ver resumo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // SUMMARY - Sessão concluída
  if (screenState === 'summary') {
    const taxa = sessionStats.total > 0
      ? Math.round((sessionStats.acertos / sessionStats.total) * 100)
      : 0;

    return (
      <View style={styles.centerContainer}>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryEmoji}>🎉</Text>
          <Text style={styles.summaryTitle}>Sessão concluída!</Text>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{sessionStats.total}</Text>
              <Text style={styles.summaryStatLabel}>Frases</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatValue, { color: Colors.accent.green }]}>
                {sessionStats.acertos}
              </Text>
              <Text style={styles.summaryStatLabel}>Acertos</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatValue, { color: Colors.accent.red }]}>
                {sessionStats.erros}
              </Text>
              <Text style={styles.summaryStatLabel}>Erros</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatValue, { color: Colors.brand.secondary }]}>
                {taxa}%
              </Text>
              <Text style={styles.summaryStatLabel}>Taxa</Text>
            </View>
          </View>

          <Text style={styles.summaryMessage}>
            {taxa >= 80
              ? 'Excelente! Você está arrasando! 🔥'
              : taxa >= 50
              ? 'Bom trabalho! Continue praticando! 💪'
              : 'Cada erro é um aprendizado! Amanhã será melhor! 📈'}
          </Text>

          <TouchableOpacity
            style={styles.summaryButton}
            onPress={() => {
              setScreenState('ready');
              setFrases([]);
              setCurrentIndex(0);
              setFeedback(null);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.summaryButtonText}>Voltar ao início</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ERROR
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorEmoji}>😕</Text>
      <Text style={styles.errorText}>Algo deu errado</Text>
      <TouchableOpacity style={styles.retryButton} onPress={checkSession}>
        <Text style={styles.retryButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================
// ESTILOS
// ============================================
const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  loadingText: {
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    fontSize: FontSize.md,
  },

  // READY
  readyContent: {
    alignItems: 'center',
    width: '100%',
  },
  readyEmoji: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  readyTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  readySubtitle: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.xl,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.brand.secondary,
  },
  quickStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: Colors.border.primary,
  },
  startButton: {
    backgroundColor: Colors.brand.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 18,
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },

  // SESSION (phrase + feedback)
  sessionContainer: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    paddingTop: 50,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.bg.tertiary,
    marginHorizontal: Spacing.lg,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.brand.primary,
    borderRadius: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sessionCounter: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  sessionType: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
  },

  // PHRASE
  phraseCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  phraseText: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 40,
  },
  phraseHint: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.lg,
  },
  answerButtons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  answerBtn: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  answerBtnNo: {
    backgroundColor: Colors.accent.redBg,
    borderColor: Colors.accent.red + '40',
  },
  answerBtnYes: {
    backgroundColor: Colors.accent.greenBg,
    borderColor: Colors.accent.green + '40',
  },
  answerBtnEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  answerBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },

  // FEEDBACK
  feedbackContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    flexGrow: 1,
  },
  feedbackBadge: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
  },
  feedbackBadgeCorrect: {
    backgroundColor: Colors.accent.greenBg,
  },
  feedbackBadgeWrong: {
    backgroundColor: Colors.accent.blueBg,
  },
  feedbackBadgeText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  feedbackCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  feedbackFlag: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  feedbackPhrase: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  feedbackDivider: {
    height: 1,
    backgroundColor: Colors.border.primary,
    marginVertical: Spacing.md,
  },
  feedbackTranslation: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.brand.secondary,
    marginBottom: Spacing.md,
  },
  feedbackExplanation: {
    backgroundColor: Colors.bg.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  feedbackExplanationLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  feedbackExplanationText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  nextButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: Colors.brand.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },

  // SUMMARY
  summaryContent: {
    alignItems: 'center',
    width: '100%',
  },
  summaryEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  summaryStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  summaryMessage: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  summaryButton: {
    backgroundColor: Colors.brand.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  summaryButtonText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },

  // ERROR
  errorEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  retryButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.brand.primary,
  },
});
