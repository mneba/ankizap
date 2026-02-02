// ============================================
// WORDFLOW - CONFIGURAÇÕES
// ============================================
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuthContext } from '../_layout';
import { updateUserProfile } from '../../services/auth';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

export default function SettingsScreen() {
  const { user, logout, refreshProfile } = useAuthContext();

  const PERIODOS: Record<string, string> = {
    manha: '🌅 Manhã',
    almoco: '☀️ Almoço',
    tarde: '🌤️ Tarde',
    noite: '🌙 Noite',
  };

  async function togglePause() {
    if (!user) return;
    const novoPausa = !user.aceita_envios_automaticos;
    try {
      await updateUserProfile(user.id, { aceita_envios_automaticos: novoPausa });
      await refreshProfile();
      Alert.alert(
        novoPausa ? 'Retomado!' : 'Pausado!',
        novoPausa
          ? 'Seus envios automáticos foram retomados.'
          : 'Seus envios foram pausados. Use "Retomar" quando quiser voltar.'
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível alterar.');
    }
  }

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Configurações</Text>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Nome</Text>
            <Text style={styles.rowValue}>{user?.nome || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue}>{user?.email || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status</Text>
            <Text style={[styles.rowValue, { textTransform: 'capitalize' }]}>
              {user?.status || '-'}
            </Text>
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Horário</Text>
            <Text style={styles.rowValue}>
              {PERIODOS[user?.horario_preferido || 'manha']}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Frases/dia</Text>
            <Text style={styles.rowValue}>{user?.frases_por_dia || 5}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Áudio</Text>
            <Text style={styles.rowValue}>
              {user?.audio_habilitado ? 'Ativado' : 'Desativado'}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={togglePause}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>
            {user?.aceita_envios_automaticos
              ? '⏸️ Pausar notificações'
              : '▶️ Retomar notificações'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionButtonText, styles.logoutText]}>
            Sair da conta
          </Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.version}>WordFlow v1.0.0</Text>
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
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.secondary,
  },
  rowLabel: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
  },
  rowValue: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  actionButton: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  actionButtonText: {
    fontSize: FontSize.md,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  logoutButton: {
    borderColor: Colors.accent.red + '30',
  },
  logoutText: {
    color: Colors.accent.red,
  },
  version: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
