import { FloatingMenu } from "@/components/floating-menu";
import { HorizontalCalendar } from "@/components/layout/pages/index/calender/HorizontalCalendar";
import { DeedListSection } from "@/components/layout/pages/index/deed-list/DeedListSection";
import { HomeHeader } from "@/components/layout/pages/index/header/HomeHeader";
import { StatsSection } from "@/components/layout/pages/index/stats/StatsSection";
import { useColor } from "@/theme/useColor";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const backgroundColor = useColor("background");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <HomeHeader />
      {/* <CalendarProvider date={selectedDate}> */}
      <HorizontalCalendar />

      <View style={styles.listContainer}>
        <DeedListSection ListHeaderComponent={<StatsSection />} />
      </View>
      <FloatingMenu />
      {/* </CalendarProvider> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
});
