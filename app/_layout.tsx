// ============================================
// WORDFLOW - ROOT LAYOUT
// ============================================
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../constants/colors';

// Context para compartilhar auth em todo app
import { createContext, useContext } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  register: (email: string, password: string, nome: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export default function RootLayout() {
  const { isLoading, isLoggedIn, user, register, login, logout, refreshProfile } =
    useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Navegação automática baseada no estado de auth
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';

    if (!isLoggedIn && !inAuthGroup) {
      // Não logado → tela de auth
      router.replace('/auth/login');
    } else if (isLoggedIn && inAuthGroup) {
      // Logado mas na tela de auth
      if (user && !user.onboarding_completo) {
        router.replace('/onboarding/choose-notebook');
      } else {
        router.replace('/(tabs)/home');
      }
    } else if (isLoggedIn && !inOnboardingGroup && user && !user.onboarding_completo) {
      // Logado mas onboarding não completo
      router.replace('/onboarding/choose-notebook');
    }
  }, [isLoading, isLoggedIn, user, segments]);

  // Tela de loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, register, login, logout, refreshProfile }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="auth" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="light" />
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg.primary,
  },
});
