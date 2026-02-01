import { Text } from "@/components/ui/text";
import { useAppStore } from "@/store/useAppStore";
import { useColors } from "@/theme/useColors";
import { format } from "date-fns";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const HeaderCalenderTodayButton = () => {
  const goToToday = useAppStore((s) => s.goToToday);
  const { active } = useColors();
  const selectedDate = useAppStore((s) => s.selectedDate);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const isToday = selectedDate === todayStr;

  // Eğer zaten bugün seçiliyse butonu gösterme
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
    borderRadius: 8,
    marginRight: 2,
  },
  todayBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
});
