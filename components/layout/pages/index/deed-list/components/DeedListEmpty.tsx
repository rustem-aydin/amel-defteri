import { Text } from "@/components/ui/text";
import { useAppStore } from "@/store/useAppStore";
import { Spacing, Typography } from "@/theme/globals";
import { useColors } from "@/theme/useColors";
import React from "react";
import { StyleSheet, View } from "react-native";

export const DeedListEmpty = () => {
  const viewMode = useAppStore((s) => s.viewMode);
  const { textMuted } = useColors();

  return (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: textMuted }]}>
        {viewMode === "time"
          ? "Şu an aktif süreli amel yok."
          : "Bugün için planlanmış amel yok."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: Typography.body,
    opacity: 0.6,
  },
});
