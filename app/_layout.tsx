import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Colors, DarkColors } from '@/theme';
import { initDb } from '@/database/db';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;

  useEffect(() => {
    try {
      initDb();
    } catch (e) {
      console.error('Failed to initialize local database:', e);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.black,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.surface },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="article/preview"
          options={{
            title: 'Article Preview',
            headerBackTitle: 'Back',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="article/loading"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="editor/[cardId]"
          options={{
            title: 'Card Studio',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="history/index"
          options={{ title: 'History' }}
        />
        <Stack.Screen
          name="settings/index"
          options={{ title: 'Settings' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
