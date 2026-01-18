import { Text } from "@/components/ui/text";
import React from "react";
import { StyleSheet } from "react-native";

export const SectionHeader = ({ children }: { children: string }) => (
  <Text style={styles.text}>{children}</Text>
);

const styles = StyleSheet.create({
  text: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
