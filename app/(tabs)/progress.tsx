// ============================================
// WORDFLOW - PROGRESSO / DASHBOARD
// ============================================
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuthContext } from '../_layout';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

export default function ProgressScreen() {
  const { user } = useAuthContext();

  const totalVistas = user?.total_frases_vistas || 0;
  const totalCorretas = user?.total_frases_corretas || 0;
  const taxa = totalVistas > 0 ? Math.round((totalCorretas / totalVistas) * 100) : 0;
  const dias = user?.dias_consecutivos || 0;

  const NIVEL_LABELS: Record<string, string> = {
    basico: 'Básico',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Seu Progresso</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            {NIVEL_LABELS[user?.nivel || 'basico']}
          </Text>
        </View>
      </View>

      {/* Main Stats */}
      <View style={styles.mainStats}>
        <View style={styles.mainStatCard}>
          <Text style={styles.mainStatValue}>{dias}</Text>
          <Text style={styles.mainStatLabel}>Dias 🔥</Text>
        </View>
        <View style={styles.mainStatCard}>
          <Text style={styles.mainStatValue}>{totalVistas}</Text>
          <Text style={styles.mainStatLabel}>Praticadas</Text>
        </View>
        <View style={styles.mainStatCard}>
          <Text style={[styles.mainStatValue, { color: Colors.accent.green }]}>
            {taxa}%
          </Text>
          <Text style={styles.mainStatLabel}>Acerto</Text>
        </View>
      </View>

      {/* Detail Cards */}
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Resumo</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Frases praticadas</Text>
          <Text style={styles.detailValue}>{totalVistas}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Acertos</Text>
          <Text style={[styles.detailValue, { color: Colors.accent.green }]}>
            {totalCorretas}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Erros</Text>
          <Text style={[styles.detailValue, { color: Colors.accent.red }]}>
            {totalVistas - totalCorretas}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Nível atual</Text>
          <Text style={styles.detailValue}>
            {NIVEL_LABELS[user?.nivel || 'basico']}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Frases/dia</Text>
          <Text style={styles.detailValue}>{user?.frases_por_dia || 5}</Text>
        </View>
      </View>

      {/* Trial info */}
      {user?.status === 'trial' && user?.trial_fim && (
        <View style={styles.trialCard}>
          <Text style={styles.trialTitle}>⏰ Período de teste</Text>
          <Text style={styles.trialText}>
            Expira em{' '}
            {Math.max(
              0,
              Math.ceil(
                (new Date(user.trial_fim).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
            )}{' '}
            dias
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  levelBadge: {
    backgroundColor: Colors.brand.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  levelText: {
    fontSize: FontSize.sm,
    color: Colors.brand.primary,
    fontWeight: '600',
  },
  mainStats: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  mainStatCard: {
    flex: 1,
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  mainStatValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.brand.secondary,
  },
  mainStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.text.tertiary,
    marginTop: 4,
  },
  detailCard: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    marginBottom: Spacing.md,
  },
  detailTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.secondary,
  },
  detailLabel: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
  },
  detailValue: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  trialCard: {
    backgroundColor: Colors.accent.yellowBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accent.yellow + '30',
  },
  trialTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  trialText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
});
