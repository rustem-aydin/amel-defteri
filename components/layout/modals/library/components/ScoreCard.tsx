import { Text } from "@/components/ui/text";
import { Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";
import { Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { PuanPill } from "./ScorePill";

export const ScoreCard = ({ total, niyet, amel, color }: any) => {
  const cardBg = useColor("card");
  const textColor = useColor("text");

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Star
        color={color}
        size={120}
        opacity={0.1}
        fill={color}
        style={styles.watermark}
      />
      <Text style={[styles.label, { color }]}>AMEL DEĞERİ</Text>
      <View style={styles.scoreRow}>
        <Text style={[styles.total, { color: textColor }]}>{total}</Text>
        <Text style={[styles.unit, { color }]}>Puan</Text>
      </View>
      <View style={styles.pills}>
        <PuanPill label={`+${niyet} Niyet`} />
        <PuanPill label={`+${amel} Tamamlama`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 24, padding: Spacing.lg, overflow: "hidden" },
  watermark: { position: "absolute", right: -30, top: -30 },
  label: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  scoreRow: { flexDirection: "row", alignItems: "baseline" },
  total: { fontSize: 48, fontWeight: "900" },
  unit: { fontSize: 20, fontWeight: "700", marginLeft: 6 },
  pills: { flexDirection: "row", gap: 8, marginTop: Spacing.md },
});
