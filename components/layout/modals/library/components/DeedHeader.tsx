import { Text } from "@/components/ui/text";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "./StatusBadge";

export const DeedHeader = ({ title, status, isAdded, onBack, color }: any) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onBack} style={styles.left}>
      <ChevronLeft color="rgba(255,255,255,0.7)" size={28} />
      <Text style={styles.title}>{title}</Text>
      <StatusBadge label={status} color={color} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center" },
  title: { color: "#fff", fontSize: 18, fontWeight: "800", marginLeft: 8 },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
