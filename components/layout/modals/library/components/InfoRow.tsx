import { Zap } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const InfoRow = ({ text }: { text: string }) => (
  <View style={styles.infoRow}>
    <Zap size={14} color="rgba(255,255,255,0.5)" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontStyle: "italic",
    flex: 1,
  },
});
