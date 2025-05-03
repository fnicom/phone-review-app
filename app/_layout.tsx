import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F5F5F5', // cinza claro
    primary: '#6C47FF',    // roxo principal
    card: '#FFFFFF',       // branco
    text: '#22223B',       // texto escuro
    border: '#E0E0E0',     // cinza médio
    notification: '#FF9800', // laranja destaque
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    ...MaterialIcons.font,
    ...Ionicons.font,
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{
        headerTitleStyle: { fontFamily: 'Inter_700Bold', color: '#22223B' },
        headerStyle: { backgroundColor: '#6C47FF' },
        headerTintColor: '#FFF',
      }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
