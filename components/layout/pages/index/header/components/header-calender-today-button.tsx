import { Text } from "@/components/ui/text";
import { useAppStore } from "@/store/useAppStore";
import { useColors } from "@/theme/useColors";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const HeaderCalenderTodayButton = () => {
  const goToToday = useAppStore((s) => s.goToToday);
  const { active } = useColors();
  const selectedHijriDate = useAppStore((s) => s.selectedHijriDate);
  const effectiveHijriToday = useAppStore((s) => s.effectiveHijriToday);

  const isToday = selectedHijriDate === effectiveHijriToday;

  if (isToday) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={goToToday}
      style={[styles.todayBtn, { backgroundColor: active }]}
    >
      <Text style={styles.todayBtnText}>Bugün</Text>
    </TouchableOpacity>
  );
};

export default HeaderCalenderTodayButton;

const styles = StyleSheet.create({
  todayBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 2,
  },
  todayBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
});
