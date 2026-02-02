// ============================================
// WORDFLOW - ESCOLHER CADERNO
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
import { useRouter } from 'expo-router';
import { getCadernos } from '../../services/session';
import type { Caderno } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

export default function ChooseNotebookScreen() {
  const router = useRouter();
  const [cadernos, setCadernos] = useState<Caderno[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCadernos();
  }, []);

  async function loadCadernos() {
    try {
      const data = await getCadernos();
      setCadernos(data);
    } catch (err) {
      console.error('Erro ao carregar cadernos:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (!selected) return;
    const caderno = cadernos.find(c => c.id === selected);
    router.push({
      pathname: '/onboarding/assessment',
      params: {
        caderno_id: selected,
        caderno_tipo: caderno?.tipo || 'padrao',
        caderno_nome: caderno?.nome || '',
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.step}>Passo 1 de 4</Text>
        <Text style={styles.title}>Escolha seu caderno</Text>
        <Text style={styles.subtitle}>
          O que você quer destravar primeiro?
        </Text>
      </View>

      {/* Cards */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {cadernos.map(caderno => {
          const isSelected = selected === caderno.id;
          return (
            <TouchableOpacity
              key={caderno.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setSelected(caderno.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{caderno.icone || '📚'}</Text>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardName, isSelected && styles.cardNameSelected]}>
                    {caderno.nome}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {caderno.total_frases} frases
                    {caderno.tipo === 'padrao' && ' • Recomendado'}
                  </Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </View>
              {caderno.descricao && (
                <Text style={styles.cardDesc}>{caderno.descricao}</Text>
              )}
              {caderno.tipo === 'padrao' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>RECOMENDADO</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selected && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selected}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg.primary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.bg.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border.secondary,
  },
  cardSelected: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.bg.elevated,
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
  cardNameSelected: {
    color: Colors.brand.secondary,
  },
  cardMeta: {
    fontSize: FontSize.sm,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  cardDesc: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    lineHeight: 20,
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
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.brand.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  badgeText: {
    fontSize: FontSize.xs,
    color: Colors.brand.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    opacity: 0.4,
  },
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});
