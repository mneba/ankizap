import { Redirect } from 'expo-router';

export default function Index() {
  // Root layout cuida do redirect baseado no auth state
  return <Redirect href="/auth/login" />;
}
