import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useCallback } from 'react';
import { useShareIntent } from 'expo-share-intent';
import { Colors, DarkColors } from '@/theme';
import { initDb } from '@/database/db';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;
  const router = useRouter();

  const { hasShareIntent, shareIntent, resetShareIntent, error } = useShareIntent({
    disabled: false // Let it run in production APK
  });

  useEffect(() => {
    try {
      initDb();
    } catch (e) {
      console.error('Failed to initialize local database:', e);
    }
  }, []);

  // Global share intent listener
  useEffect(() => {
    if (hasShareIntent && shareIntent && (shareIntent as any).value) {
      // Find the first URL in the shared text
      const urlMatch = ((shareIntent as any).value as string).match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        const extractedUrl = urlMatch[0];
        
        // Clear the intent so it doesn't trigger again on re-focus
        resetShareIntent();

        // Immediately trigger the card creation flow
        router.push({
          pathname: '/article/preview',
          params: { url: extractedUrl }
        });
      }
    }
  }, [hasShareIntent, shareIntent, resetShareIntent, router]);

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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
          name="share"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
