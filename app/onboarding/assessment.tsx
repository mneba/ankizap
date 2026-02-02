// ============================================
// WORDFLOW - AVALIAÇÃO DE NÍVEL
// REGRA DE OURO: Sempre usa CADERNO PADRÃO!
// ============================================
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarFrasesOnboarding } from '../../services/session';
import type { AvaliacaoFrase } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

export default function AssessmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    caderno_id: string;
    caderno_tipo: string;
    caderno_nome: string;
  }>();

  const [frases, setFrases] = useState<AvaliacaoFrase[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFrases();
  }, []);

  async function loadFrases() {
    try {
      // SEMPRE caderno padrão para avaliação!
      const data = await buscarFrasesOnboarding('padrao', 10);
      if (data?.frases) {
        setFrases(
          data.frases.map((f: any) => ({
            frase_id: f.id,
            frase: f.frase,
            nivel: f.nivel,
            conhece: true, // Default: marca como "conheço"
          }))
        );
      }
    } catch (err) {
      console.error('Erro ao carregar frases:', err);
    } finally {
      setLoading(false);
    }
  }

  const toggleFrase = (index: number) => {
    setFrases(prev =>
      prev.map((f, i) => (i === index ? { ...f, conhece: !f.conhece } : f))
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    router.push({
      pathname: '/onboarding/result',
      params: {
        caderno_id: params.caderno_id,
        caderno_tipo: params.caderno_tipo,
        caderno_nome: params.caderno_nome,
        avaliacoes: JSON.stringify(frases),
      },
    });
  };

  const naoConheco = frases.filter(f => !f.conhece).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
        <Text style={styles.loadingText}>Preparando avaliação...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.step}>Passo 2 de 4</Text>
        <Text style={styles.title}>Avaliação rápida</Text>
        <Text style={styles.subtitle}>
          Marque as frases que você NÃO conhece
        </Text>
      </View>

      {/* Counter */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {naoConheco} de {frases.length} marcadas como desconhecidas
        </Text>
      </View>

      {/* Phrases List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {frases.map((frase, index) => {
          const naoConhece = !frase.conhece;
          return (
            <TouchableOpacity
              key={frase.frase_id}
              style={[styles.phraseCard, naoConhece && styles.phraseCardMarked]}
              onPress={() => toggleFrase(index)}
              activeOpacity={0.7}
            >
              <View style={styles.phraseContent}>
                <View style={styles.phraseNumber}>
                  <Text style={styles.phraseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.phraseInfo}>
                  <Text style={styles.phraseText}>{frase.frase}</Text>
                  <Text style={styles.phraseLevel}>
                    {frase.nivel === 'basico' ? '🟢' : frase.nivel === 'intermediario' ? '🟡' : '🔴'}{' '}
                    {frase.nivel}
                  </Text>
                </View>
              </View>
              <View style={[styles.checkbox, naoConhece && styles.checkboxChecked]}>
                {naoConhece && <Text style={styles.checkmark}>✕</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerHint}>
          Seja honesto! Isso ajuda a calibrar seu nível.
        </Text>
        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.text.primary} />
          ) : (
            <Text style={styles.buttonText}>Finalizar avaliação</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.sm,
  },
  step: {
    fontSize: FontSize.sm,
    color: Colors.brand.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  counter: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  counterText: {
    fontSize: FontSize.sm,
    color: Colors.accent.yellow,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  phraseCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  phraseCardMarked: {
    borderColor: Colors.accent.red + '60',
    backgroundColor: Colors.accent.redBg,
  },
  phraseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phraseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bg.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  phraseNumberText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  phraseInfo: {
    flex: 1,
  },
  phraseText: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  phraseLevel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  checkboxChecked: {
    borderColor: Colors.accent.red,
    backgroundColor: Colors.accent.red,
  },
  checkmark: {
    color: Colors.text.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    paddingTop: Spacing.sm,
  },
  footerHint: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  button: {
    backgroundColor: Colors.brand.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});
