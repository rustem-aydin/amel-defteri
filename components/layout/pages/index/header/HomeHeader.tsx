import React from "react";
import { StyleSheet, View } from "react-native";

import DeedCardModes from "@/components/layout/pages/index/header/components/deed-card-modes";
import HeaderCalenderTodayButton from "@/components/layout/pages/index/header/components/header-calender-today-button";
import HeaderHijriDate from "@/components/layout/pages/index/header/components/header-hijri-date";
import { Spacing } from "@/theme/globals";
import { useColors } from "@/theme/useColors";
import { SheetNavigation } from "../left-sheet/Sheet";
import HeaderAllPoints from "./components/header-all-points";

export const HomeHeader = () => {
  const { background } = useColors();

  return (
    <View style={[styles.header, { backgroundColor: background }]}>
      <View style={{ marginRight: 8 }}>
        <SheetNavigation />
      </View>

      <HeaderHijriDate />

      <View style={styles.rightActions}>
        <HeaderCalenderTodayButton />
        {/* <ThemeToggle /> */}
        <DeedCardModes />
        <HeaderAllPoints />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
