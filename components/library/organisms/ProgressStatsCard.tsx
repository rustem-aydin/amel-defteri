// components/library/organisms/ProgressStatsCard.tsx
import { ChartContainer } from "@/components/charts/chart-container";
import { ProgressRingChart } from "@/components/charts/progress-ring-chart";
import { Text } from "@/components/ui/text";
import { useColor } from "@/theme/useColor";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

export const ProgressStatsCard = memo(
  ({ completed, total, points, progressValue }: any) => {
    const cardColor = useColor("card");
    const cardBorder = useColor("cardBorder");
    const iconBg = useColor("iconBg");

    return (
      <View
        style={[
          styles.progressCard,
          { backgroundColor: cardColor, borderColor: cardBorder },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Günün Bereketi</Text>
          <Text style={styles.cardSubtitle}>
            {completed}/{total} Amel Tamamlandı
          </Text>

          <View
            style={[
              styles.pointBadge,
              { backgroundColor: iconBg, borderRadius: 10 },
            ]}
          >
            <Ionicons name="ribbon" size={18} color="gold" />
            <View style={{ marginLeft: 8 }}>
              <Text style={{ color: "#94a3b8", fontSize: 8 }}>
                KAZANILAN PUAN
              </Text>
              <Text variant="title">{points}</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartWrapper}>
          <ChartContainer>
            <ProgressRingChart
              progress={progressValue}
              size={90}
              strokeWidth={8}
              config={{
                animated: true,
                duration: 1000,
                gradient: true,
              }}
              showLabel={true}
            />
          </ChartContainer>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  progressCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "white" },
  cardSubtitle: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  pointBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 15,
    alignSelf: "flex-start",
  },
  chartWrapper: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
