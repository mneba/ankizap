import { Stack } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="choose-notebook" />
      <Stack.Screen name="assessment" />
      <Stack.Screen name="result" />
      <Stack.Screen name="preferences" />
    </Stack>
  );
}
