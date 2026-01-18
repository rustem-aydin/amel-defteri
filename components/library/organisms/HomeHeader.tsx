import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// HATA BURADAYDI: ThemeToggle import edilmemişti

// Tema ve Sabitler
import { Sizes, Spacing } from "@/theme/globals";
import { ThemeToggle } from "@/theme/theme-toggle";
import { useColor } from "@/theme/useColor";

export const HomeHeader = memo(
  ({
    selectedDate,
    isToday,
    onGoToToday,
    isLiveOnly,
    onToggleLive,
    onToggleFilter,
  }: any) => {
    // Renkleri temadan çekiyoruz (Hardcoded renkleri sildik)
    const backgroundColor = useColor("background");
    const textMuted = useColor("textMuted");
    const iconBg = useColor("iconBg"); // Senin tanımladığın icon arka planı
    const primary = useColor("active"); // #10b981
    const iconColor = useColor("text");

    const hijriDate = useMemo(() => {
      try {
        const date = new Date(selectedDate);
        return new Intl.DateTimeFormat("tr-u-ca-islamic-uma-nu-latn", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(date);
      } catch (e) {
        return "";
      }
    }, [selectedDate]);

    return (
      <View style={[styles.header, { backgroundColor }]}>
        <View style={styles.leftSection}>
          <Text style={[styles.hijriText, { color: textMuted }]}>
            {hijriDate}
          </Text>
        </View>

        <View style={styles.rightActions}>
          {!isToday && (
            <TouchableOpacity
              onPress={onGoToToday}
              style={[styles.todayBtn, { backgroundColor: primary }]}
            >
              <Text style={styles.todayBtnText}>Bugün</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: iconBg }]}
          >
            <Ionicons name="trophy-outline" size={20} color="gold" />
          </TouchableOpacity>

          <ThemeToggle />

          <TouchableOpacity
            onPress={onToggleLive}
            style={[
              styles.actionBtn,
              { backgroundColor: iconBg },
              isLiveOnly && { backgroundColor: primary },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={isLiveOnly ? "#000" : iconColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onToggleFilter}
            style={[styles.actionBtn, { backgroundColor: iconBg }]}
          >
            <Ionicons name="filter-outline" size={20} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    alignItems: "center",
    height: 60,
  },
  leftSection: { flex: 1 },
  hijriText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  actionBtn: {
    width: Sizes.ICON_BUTTON_SIZE,
    height: Sizes.ICON_BUTTON_SIZE,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  todayBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  todayBtnText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
});
