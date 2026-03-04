import { Text } from "@/components/ui/text";
import { withOpacity } from "@/theme/colors";
import { Typography } from "@/theme/globals";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface DeedBadgeProps {
  viewMode: string;
  points: number;
  level: number;
  color: string;
  isDone: boolean;
  isFutureDate?: boolean;
}

export const DeedBadge = React.memo(
  ({
    viewMode,
    points,
    level,
    color,
    isDone,
    isFutureDate,
  }: DeedBadgeProps) => {
    // Gelecek tarihse badge gösterme (boş alan kalsın diye View dönebiliriz)
    if (isFutureDate) {
      // Pasif yeşil renkle saat ikonu
      const futureColor = withOpacity(color, 0.3);
      const futureBg = withOpacity(color, 0.05);

      return (
        <View
          style={[
            styles.levelBadge,
            { borderColor: futureColor, backgroundColor: futureBg },
          ]}
        >
          <Ionicons name="time-outline" size={26} color={futureColor} />
        </View>
      );
    }

    // Tamamlandıysa canlı renk, değilse sönük (pasif) renk
    const activeOpacity = isDone ? 1 : 0.3;
    const bgOpacity = isDone ? 0.15 : 0.05;

    const badgeStyle = [
      styles.levelBadge,
      {
        borderColor: withOpacity(color, activeOpacity),
        backgroundColor: withOpacity(color, bgOpacity),
      },
    ];

    const contentColor = withOpacity(color, isDone ? 1 : 0.5);

    if (viewMode === "time") {
      return (
        <View style={badgeStyle}>
          <Ionicons name="time-outline" size={26} color={contentColor} />
        </View>
      );
    }

    const label = viewMode === "info" ? "PUAN" : "LVL";
    const value = viewMode === "info" ? points : level || 1;

    return (
      <View style={badgeStyle}>
        <View style={styles.centerContent}>
          <Text style={[styles.levelLabel, { color: contentColor }]}>
            {label}
          </Text>
          <Text style={[styles.levelNumber, { color: contentColor }]}>
            {value}
          </Text>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  levelBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  levelLabel: {
    fontSize: 9,
    fontWeight: "900",
    marginBottom: -2,
    letterSpacing: 0.5,
  },
  levelNumber: {
    fontSize: Typography.h3,
    fontWeight: "bold",
  },
});
