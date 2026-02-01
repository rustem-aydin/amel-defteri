import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useDateInfo } from "@/hooks/useDateTags";
import { useAppStore } from "@/store/useAppStore";
import { useColors } from "@/theme/useColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";

const HeaderHijriDate = () => {
  const { textMuted } = useColors();

  const selectedDate = useAppStore((s) => s.selectedDate);

  const { hijri, specialDayName, isSpecial } = useDateInfo(selectedDate);

  return (
    <View style={styles.leftSection}>
      <Text
        style={[styles.hijriText, { color: isSpecial ? "#d4af37" : "white" }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {hijri?.fullDate}
      </Text>

      {isSpecial && specialDayName && (
        <View style={styles.specialBadgeContainer}>
          <Ionicons
            name="sparkles"
            size={10}
            color="#fff"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.specialBadgeText} numberOfLines={1}>
            {specialDayName}
          </Text>
        </View>
      )}
    </View>
  );
};

export default HeaderHijriDate;
const styles = StyleSheet.create({
  leftSection: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginRight: 10,
  },
  hijriText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  specialBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d4af37",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    shadowColor: "#d4af37",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
    maxWidth: "100%",
  },
  specialBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
