import { Text } from "@/components/ui/text";
import { useTimeReferences } from "@/context/TimeEngineContext";
import { addHijriDays, formatHijriDateShort } from "@/helpers/hijriUtils";
import { useColors } from "@/theme/useColors";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

export const ProgressStatsCard = memo(({ completed, total, points }: any) => {
  const { card, cardBorder, iconBg } = useColors();
  const engine = useTimeReferences();

  let targetHijriDate = engine?.actualDateHijri;
  if (engine?.effectiveDateHijri) {
    targetHijriDate = addHijriDays(engine.effectiveDateHijri, 1);
  }

  const nextDayName = targetHijriDate
    ? formatHijriDateShort(targetHijriDate)
    : "Yeni Güne";

  return (
    <View
      style={[
        styles.progressCard,
        {
          backgroundColor: card,
          borderColor: cardBorder,
        },
      ]}
    >
      <View>
        <Text style={styles.cardTitle}>Günün Bereketi</Text>
        <Text style={styles.cardSubtitle}>
          {completed}/{total} Amel Tamamlandı
        </Text>
      </View>

      <View
        style={[
          styles.pointBadge,
          { backgroundColor: iconBg, borderRadius: 10 },
        ]}
      >
        <Ionicons name="ribbon" size={18} color="gold" />
        <View style={{ marginLeft: 8 }}>
          <Text style={{ color: "#94a3b8", fontSize: 8 }}>KAZANILAN PUAN</Text>
          <Text variant="title">{points}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  progressCard: {
    justifyContent: "space-between",
    borderRadius: 24,
    padding: 10,

    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "white" },
  cardSubtitle: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  countdownText: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    fontVariant: ["tabular-nums"],
  },
  pointBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
});
