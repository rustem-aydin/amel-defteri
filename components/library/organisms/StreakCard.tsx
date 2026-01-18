import { Text } from "@/components/ui/text";
import { Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SectionHeader } from "../atoms/SectionHeader";
import { HeatBox } from "../molecules/HeatBox";
import { InfoRow } from "../molecules/InfoRow";

export const StreakCard = ({ level, multiplier, streakData, color }: any) => {
  const cardBg = useColor("card");
  const textColor = useColor("text");
  const textMuted = useColor("textMuted");

  return (
    <View style={styles.container}>
      <SectionHeader>SERİ DURUMU (SON 21 GÜN)</SectionHeader>
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.label, { color: textMuted }]}>
              MEVCUT SEVİYE
            </Text>
            <Text style={[styles.levelTitle, { color: textColor }]}>
              Seviye {level}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.label, { color: textMuted }]}>
              PUAN ÇARPANI
            </Text>
            <Text style={[styles.multiplier, { color }]}>
              x{multiplier} Puan
            </Text>
          </View>
        </View>
        <View style={styles.heatmap}>
          {streakData.map((active: number, i: number) => (
            <HeatBox key={i} active={active === 1} color={color} />
          ))}
        </View>
        <InfoRow text="1 gün ara verilirse seviye sıfırlanır. İstikrar bereketi getirir." />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: Spacing.lg },
  card: { borderRadius: 24, padding: Spacing.lg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: { fontSize: 10, fontWeight: "800" },
  levelTitle: { fontSize: 24, fontWeight: "900" },
  multiplier: { fontSize: 20, fontWeight: "900" },
  heatmap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
});
