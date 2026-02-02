// ============================================
// WORDFLOW - RESULTADO DA AVALIAÇÃO
// ============================================
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthContext } from '../_layout';
import { processarOnboarding } from '../../services/session';
import type { OnboardingResult } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

const NIVEL_LABELS: Record<string, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

const NIVEL_EMOJIS: Record<string, string> = {
  basico: '🟢',
  intermediario: '🟡',
  avancado: '🔴',
};

export default function ResultScreen() {
  const router = useRouter();
  const { user } = useAuthContext();
  const params = useLocalSearchParams<{
    caderno_id: string;
    caderno_tipo: string;
    caderno_nome: string;
    avaliacoes: string;
  }>();

  const [result, setResult] = useState<OnboardingResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    processarAvaliacao();
  }, []);

  async function processarAvaliacao() {
    if (!user?.id || !params.avaliacoes) return;

    try {
      const avaliacoes = JSON.parse(params.avaliacoes);
      const data = await processarOnboarding(
        user.id,
        params.caderno_id,
        params.caderno_tipo,
        avaliacoes
      );
      setResult(data as OnboardingResult);
    } catch (err) {
      console.error('Erro ao processar:', err);
      // Fallback: nível básico
      setResult({
        nivel_detectado: 'basico',
        frases_para_aprender: 8,
        frases_dominadas: 2,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/preferences',
      params: {
        nivel: result?.nivel_detectado || 'basico',
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
        <Text style={styles.loadingText}>Analisando seu nível...</Text>
      </View>
    );
  }

  const nivel = result?.nivel_detectado || 'basico';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Step indicator */}
        <Text style={styles.step}>Passo 3 de 4</Text>

        {/* Result Card */}
        <View style={styles.resultCard}>
          <Text style={styles.emoji}>{NIVEL_EMOJIS[nivel]}</Text>
          <Text style={styles.resultTitle}>Seu nível</Text>
          <Text style={styles.nivel}>{NIVEL_LABELS[nivel]}</Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{result?.frases_dominadas || 0}</Text>
              <Text style={styles.statLabel}>Já domina</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{result?.frases_para_aprender || 0}</Text>
              <Text style={styles.statLabel}>Para aprender</Text>
            </View>
          </View>
        </View>

        {/* Explanation */}
        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>O que isso significa?</Text>
          <Text style={styles.explanationText}>
            Vamos começar com frases do nível {NIVEL_LABELS[nivel].toLowerCase()} e ir
            aumentando conforme você evolui. O sistema detecta automaticamente quando você
            está pronto para subir de nível.
          </Text>
        </View>

        {/* Notebook chosen */}
        <View style={styles.notebookInfo}>
          <Text style={styles.notebookLabel}>Caderno escolhido</Text>
          <Text style={styles.notebookName}>{params.caderno_nome || 'Inglês Geral'}</Text>
        </View>
      </View>

      {/* Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg.primary,
  },
  loadingText: {
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    fontSize: FontSize.md,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
  },
  step: {
    fontSize: FontSize.sm,
    color: Colors.brand.primary,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  resultCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  emoji: {
    fontSize: 56,
    marginBottom: Spacing.sm,
  },
  resultTitle: {
    fontSize: FontSize.md,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  nivel: {
    fontSize: FontSize.hero,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.brand.secondary,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border.primary,
  },
  explanation: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  explanationTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  explanationText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  notebookInfo: {
    marginTop: Spacing.md,
    backgroundColor: Colors.brand.primary + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notebookLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  notebookName: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.brand.secondary,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: Colors.brand.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});
