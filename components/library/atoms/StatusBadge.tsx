import { Text } from "@/components/ui/text";
import React from "react";
import { StyleSheet, View } from "react-native";

export const StatusBadge = ({
  label,
  color,
}: {
  label: string;
  color: string;
}) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
