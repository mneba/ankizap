// ============================================
// WORDFLOW - CADERNOS
// ============================================
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuthContext } from '../_layout';
import { getCadernos } from '../../services/session';
import { updateUserProfile } from '../../services/auth';
import type { Caderno } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

export default function NotebooksScreen() {
  const { user, refreshProfile } = useAuthContext();
  const [cadernos, setCadernos] = useState<Caderno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCadernos();
  }, []);

  async function loadCadernos() {
    try {
      const data = await getCadernos();
      setCadernos(data);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }

  async function trocarCaderno(caderno: Caderno) {
    if (caderno.id === user?.caderno_ativo_id) return;

    Alert.alert(
      'Trocar caderno?',
      `Deseja trocar para "${caderno.nome}"? Seu progresso anterior é mantido.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Trocar',
          onPress: async () => {
            try {
              await updateUserProfile(user!.id, { caderno_ativo_id: caderno.id });
              await refreshProfile();
              Alert.alert('Pronto!', `Caderno trocado para "${caderno.nome}".`);
            } catch {
              Alert.alert('Erro', 'Não foi possível trocar o caderno.');
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Cadernos</Text>
      <Text style={styles.subtitle}>Escolha o foco do seu aprendizado</Text>

      {cadernos.map(caderno => {
        const isActive = caderno.id === user?.caderno_ativo_id;
        return (
          <TouchableOpacity
            key={caderno.id}
            style={[styles.card, isActive && styles.cardActive]}
            onPress={() => trocarCaderno(caderno)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{caderno.icone || '📚'}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{caderno.nome}</Text>
                <Text style={styles.cardMeta}>
                  {caderno.total_frases} frases • {caderno.tipo}
                </Text>
              </View>
              {isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ATIVO</Text>
                </View>
              )}
            </View>
            {caderno.descricao && (
              <Text style={styles.cardDesc}>{caderno.descricao}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
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
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 100,
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
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border.secondary,
  },
  cardActive: {
    borderColor: Colors.brand.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  cardMeta: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  cardDesc: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  activeBadge: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  activeBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.text.primary,
    fontWeight: '700',
  },
});
