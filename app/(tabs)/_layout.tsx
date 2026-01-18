import { Tabs } from "expo-router";
import { BarChart2, Home, Library, User } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Temalar ve Hooklar
import { Typography } from "@/theme/globals";
import { useColors } from "@/theme/useColors";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { background, active, textMuted, border } = useColors();

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: active,
          headerShown: false, // Ekranlar kendi header'larını yönetiyor

          tabBarStyle: {
            backgroundColor: background,
            borderTopWidth: 1,
            borderTopColor: border,

            // iOS'ta Home Indicator (alttaki çizgi) için dinamik yükseklik
            height: Platform.OS === "ios" ? 88 : 64,
            paddingTop: 8,
            paddingBottom: Platform.OS === "ios" ? insets.bottom : 8,

            // Hafif bir gölge efekti (isteğe bağlı)
            elevation: 0,
            shadowOpacity: 0,
          },

          tabBarLabelStyle: {
            fontSize: Typography.tiny || 11,
            fontWeight: "600",
            marginBottom: Platform.OS === "ios" ? 0 : 5,
          },

          tabBarIconStyle: {
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Ana Sayfa",
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Kütüphane",
            tabBarIcon: ({ color }) => <Library size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: "İstatistik",
            tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
