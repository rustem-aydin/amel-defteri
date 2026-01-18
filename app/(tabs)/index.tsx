import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { CalendarProvider } from "react-native-calendars";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useAppStore } from "@/store/useAppStore";
import { Sizes, Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";

// BİLEŞENLER
import { AmelCalendar } from "@/components/calender/AmelWeekCalendar";
import { DeedListSection } from "@/components/home/DeedListSection";
import { FilterSection } from "@/components/home/FilterSection"; // <--- YENİ IMPORT
import { HomeHeaderSection } from "@/components/home/HomeHeaderSection";
import { StatsSection } from "@/components/home/StatsSection";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useColor("background");

  const selectedDate = useAppStore((s) => s.selectedDate);
  const setSelectedDate = useAppStore((s) => s.setSelectedDate);
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <CalendarProvider date={selectedDate} onDateChanged={setSelectedDate}>
        <HomeHeaderSection />

        <AmelCalendar
          selectedDate={selectedDate}
          onDateChanged={setSelectedDate}
        />

        <FilterSection />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
        >
          <StatsSection />
          <DeedListSection />
        </ScrollView>
      </CalendarProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    width: 64,
    height: 64,
    borderRadius: Sizes.CORNERS,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
