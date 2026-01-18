import { Colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";

interface Props {
  value: number;
  label?: string;
  style?: TextStyle;
}

export const NumberTicker = ({ value, label, style }: Props) => {
  const formatted = value.toString().padStart(2, "0");

  return (
    <View style={styles.container}>
      <Text style={[styles.text, style]}>{formatted}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  text: {
    fontFamily: "SpaceMono",
    fontSize: 14,
    fontWeight: "900",
    color: Colors.dark.primary,
    fontVariant: ["tabular-nums"],
  },
  label: { fontSize: 8, color: "rgba(255,255,255,0.4)" },
});
