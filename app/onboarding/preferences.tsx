// ============================================
// WORDFLOW - PREFERÊNCIAS
// ============================================
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthContext } from '../_layout';
import { updateUserProfile } from '../../services/auth';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

const PERIODOS = [
  { id: 'manha', label: 'Manhã', desc: '7h - 11h', icon: '🌅' },
  { id: 'almoco', label: 'Almoço', desc: '12h - 14h', icon: '☀️' },
  { id: 'tarde', label: 'Tarde', desc: '14h - 18h', icon: '🌤️' },
  { id: 'noite', label: 'Noite', desc: '19h - 22h', icon: '🌙' },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuthContext();
  const params = useLocalSearchParams<{ nivel: string }>();

  const [periodo, setPeriodo] = useState('manha');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await updateUserProfile(user.id, {
        horario_preferido: periodo as any,
        onboarding_completo: true,
        status: 'trial',
        trial_inicio: new Date().toISOString(),
        trial_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      await refreshProfile();

      // Navega para as tabs
      router.replace('/(tabs)/home');
    } catch (err: any) {
      console.error('Erro ao salvar preferências:', err);
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.step}>Passo 4 de 4</Text>
          <Text style={styles.title}>Quando estudar?</Text>
          <Text style={styles.subtitle}>
            Escolha o melhor horário para suas sessões diárias
          </Text>
        </View>

        {/* Period Selection */}
        <View style={styles.periodList}>
          {PERIODOS.map(p => {
            const isSelected = periodo === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.periodCard, isSelected && styles.periodCardSelected]}
                onPress={() => setPeriodo(p.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.periodIcon}>{p.icon}</Text>
                <View style={styles.periodInfo}>
                  <Text
                    style={[styles.periodLabel, isSelected && styles.periodLabelSelected]}
                  >
                    {p.label}
                  </Text>
                  <Text style={styles.periodDesc}>{p.desc}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Como funciona</Text>
          <Text style={styles.infoText}>
            Você vai receber uma notificação no horário escolhido para praticar. Cada
            sessão leva menos de 5 minutos. Consistência é mais importante que quantidade!
          </Text>
        </View>
      </ScrollView>

      {/* Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleFinish}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.text.primary} />
          ) : (
            <Text style={styles.buttonText}>Começar a destravar! 🚀</Text>
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
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
  periodList: {
    gap: Spacing.sm,
  },
  periodCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border.secondary,
  },
  periodCardSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.bg.elevated,
  },
  periodIcon: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  periodInfo: {
    flex: 1,
  },
  periodLabel: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  periodLabelSelected: {
    color: Colors.brand.secondary,
  },
  periodDesc: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: Colors.brand.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.brand.primary,
  },
  infoBox: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  infoTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    paddingTop: Spacing.md,
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
