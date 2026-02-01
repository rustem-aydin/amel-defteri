import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";

// Temalar ve Hooklar
import { TimeEngineProvider } from "@/context/TimeEngineContext";
import { useModeToggle } from "@/hooks/useModeToggle";
import { Colors } from "@/theme/colors";
import { Spacing, Typography } from "@/theme/globals";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { isDark } = useModeToggle();
  const activeColors = isDark ? Colors.dark : Colors.light;

  const isInitialized = useRef(false);

  const initializeApp = useCallback(async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      setErrorMsg(null);
      await migrate(db, migrations);
      setAppReady(true);
    } catch (e: any) {
      setErrorMsg(e.message || "Veritabanı oluşturulurken hata oluştu.");
      setAppReady(false);
      isInitialized.current = false;
    } finally {
      await SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const navigationTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: activeColors.active,
        background: activeColors.background,
        card: activeColors.card,
        text: activeColors.text,
        border: activeColors.border,
        notification: activeColors.active,
      },
    }),
    [isDark, activeColors],
  );

  if (errorMsg) {
    return (
      <View
        style={[styles.center, { backgroundColor: activeColors.background }]}
      >
        <Text style={[styles.errorTitle, { color: activeColors.red }]}>
          Uygulama Başlatılamadı
        </Text>
        <Text style={[styles.errorSub, { color: activeColors.textMuted }]}>
          {errorMsg}
        </Text>
        <TouchableOpacity onPress={initializeApp} style={{ marginTop: 20 }}>
          <Text style={{ color: activeColors.active }}>Yeniden Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!appReady) {
    return (
      <View
        style={[styles.center, { backgroundColor: activeColors.background }]}
      >
        <ActivityIndicator size="large" color={activeColors.active} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={navigationTheme}>
            <TimeEngineProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: activeColors.background },
                  animation: "fade",
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen
                  options={{
                    presentation: "transparentModal",
                    animation: "fade_from_bottom",
                  }}
                  name="stats"
                />
                <Stack.Screen name="profile" />
                <Stack.Screen
                  name="library"
                  options={{
                    presentation: "transparentModal",
                    animation: "fade_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="deed/[id]"
                  options={{
                    presentation: "transparentModal",
                    animation: "fade_from_bottom",
                  }}
                />
              </Stack>
            </TimeEngineProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: Typography.h2,
    fontWeight: "bold",
    marginBottom: Spacing.sm,
  },
  errorSub: {
    fontSize: Typography.body,
    textAlign: "center",
  },
});
