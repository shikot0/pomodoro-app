import FontAwesome from '@expo/vector-icons/FontAwesome';
// import {} from '@react-navigation/native-stack';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { localSessionsStore, localSettingsStore } from '@/constants/globalState';
import AsyncStorage from '@react-native-async-storage/async-storage';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [loaded, error] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  //   ...FontAwesome.font,
  // });
  const [fontsLoaded, error] = useFonts({
    Alata: require('../assets/fonts/Alata.ttf'),
    Jakarta: require('../assets/fonts/Plus-Jakarta-Sans.ttf'),
    ...FontAwesome.font,
  });
  const {setSessions} = localSessionsStore();
  const {setSettings} = localSettingsStore();

  // const [sessionsLoaded, setSessionsLoaded] = useState<boolean>(false);
  const [localStorageLoaded, setLocalStorageLoaded] = useState<boolean>(false);
  // const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  async function getLocalStorage() {
    // const result = await AsyncStorage.getItem('sessions');
    // result !== null ? setSessions(JSON.parse(result)) : setSessions([]);
    // setSessionsLoaded(true)

    const localSessions = await AsyncStorage.getItem('sessions');
    const localSettings = await AsyncStorage.getItem('settings');
    // console.log({localSettings})
    localSessions !== null ? setSessions(JSON.parse(localSessions)) : setSessions([]);
    localSettings !== null ? setSettings(JSON.parse(localSettings)) : null;
    setLocalStorageLoaded(true)
  }

  useEffect(() => {
    // async () => {
    //   const result = await AsyncStorage.getItem('sessions');
    //   result !== null ? setSessions(result) : setSessions([]);
    //   setSessionsLoaded(true)
    // }
    getLocalStorage()
  }, [])

  // useEffect(() => {
  //   AsyncStorage.removeItem('settings')
  // }, [])
  
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // useEffect(() => {
  //   if (fontsLoaded && sessionsLoaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, sessionsLoaded, settingsLoaded]);
  useEffect(() => {
    if (fontsLoaded && localStorageLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, localStorageLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <Stack>
    //     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    //     <Stack.Screen name="settingsModal" options={{ presentation: 'transparentModal' }} />
    //   </Stack>
    // </ThemeProvider>

    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="settingsModal" options={{ presentation: 'modal' }} /> */}
            {/* <Stack.Screen name="newTimerPage" options={{ presentation: 'modal', headerShown: false }} /> */}
            <Stack.Screen name="newTimerPage" options={{ presentation: 'modal', title: 'New Timer', animation: "slide_from_bottom" }} />
          </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
