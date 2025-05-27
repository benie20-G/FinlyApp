import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { ExpensesProvider } from '@/contexts/ExpensesContext';
import { BudgetsProvider } from '@/contexts/BudgetsContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <ExpensesProvider>
        <BudgetsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
          <StatusBar style="auto" />
        </BudgetsProvider>
      </ExpensesProvider>
    </AuthProvider>
  );
}