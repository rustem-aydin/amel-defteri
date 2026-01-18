import { Text } from "@/components/ui/text";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export const TodayButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.todayBtn}>
    <Text style={styles.todayBtnText}>Bugün</Text>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  todayBtn: {
    marginLeft: 12,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  todayBtnText: { color: "#10b981", fontSize: 12, fontWeight: "600" },
});
