import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Grid, PlusCircle, Menu } from 'lucide-react-native';
import { Colors, DarkColors, Typography } from '@/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? DarkColors : Colors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // We'll build custom minimal headers per screen if needed
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.primaryBorder,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primaryText,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarLabelStyle: {
          fontSize: Typography.navLabel,
          fontWeight: Typography.medium,
        },
      }}>
      <Tabs.Screen
        name="history/index"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Grid color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
