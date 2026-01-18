import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 1. Drizzle Migration Importları
import { db } from "@/db/client"; // Kendi db dosyanızın yolu
import migrations from "@/drizzle/migrations"; // npx drizzle-kit generate ile oluşan klasör
import { migrate } from "drizzle-orm/expo-sqlite/migrator";

// Bileşenler ve Servisler
import { ToastProvider } from "@/components/ui/toast";

// Temalar ve Hooklar
import { useModeToggle } from "@/hooks/useModeToggle";
import { useLocationStore } from "@/store/useLocationStore";
import { Colors } from "@/theme/colors";
import { Spacing, Typography } from "@/theme/globals";

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
  const fetchLocation = useLocationStore((s) => s.fetchLocation);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        fetchLocation();
      }
      appState.current = nextAppState;
    });

    async function initializeApp() {
      try {
        // 2. MIGRATION İŞLEMİ (Tabloları Oluşturur)
        // Eğer tablolar yoksa oluşturur, varsa atlar.
        await migrate(db, migrations);

        // Konumu çek
        fetchLocation();

        // Gecikme simülasyonu (Opsiyonel)
        await new Promise((resolve) => setTimeout(resolve, 500));

        setAppReady(true);
      } catch (e: any) {
        setErrorMsg(e.message || "Veritabanı oluşturulurken hata oluştu.");
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();

    return () => {
      subscription.remove();
    };
  }, []);

  const navigationTheme = {
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
  };

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
        <Text
          style={{ color: activeColors.active, marginTop: 20 }}
          onPress={() => {
            setErrorMsg(null);
            setAppReady(false);
            // Hata durumunda yeniden deneme butonu
          }}
        >
          Yeniden Dene
        </Text>
      </View>
    );
  }

  if (!appReady) {
    return (
      <View
        style={[styles.center, { backgroundColor: activeColors.background }]}
      >
        <ActivityIndicator size="large" color={activeColors.active} />
        <Text style={[styles.loadingText, { color: activeColors.textMuted }]}>
          Veritabanı Hazırlanıyor...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={navigationTheme}>
          <ToastProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: activeColors.background },
                animation: "fade",
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="deed/[id]"
                options={{
                  presentation: "transparentModal",
                  animation: "fade_from_bottom",
                  contentStyle: { backgroundColor: activeColors.background },
                }}
              />
            </Stack>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
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
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.subtext,
    fontWeight: "600",
  },
});
