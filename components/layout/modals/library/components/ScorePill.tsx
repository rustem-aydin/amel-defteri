import { Text } from "@/components/ui/text";
import React from "react";
import { StyleSheet, View } from "react-native";

export const PuanPill = ({ label }: { label: string }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  text: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
