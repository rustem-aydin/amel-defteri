// components/layout/modals/stats/StatisticCard.tsx
import { AreaChart } from "@/components/ui/area-charrt";
import { Text } from "@/components/ui/text";
import React, { memo } from "react";
import { ActivityIndicator, View } from "react-native";

interface Props {
  data: any[];
  loading?: boolean;
}

export const AreaChartInteractive = memo(({ data, loading }: Props) => {
  return (
    <View style={{ gap: 2, minHeight: 250 }}>
      <Text variant="title">Toplam Puan Analizi</Text>
      <Text variant="caption">Seçili dönemdeki gelişim grafiği</Text>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <AreaChart
          data={data.length > 0 ? data : [{ x: "0", y: 0, label: "Veri Yok" }]}
          config={{
            height: 250,
            showGrid: true,
            showLabels: true,
            animated: true,
            interactive: true,
            showYLabels: true,
            yLabelCount: 5,
          }}
        />
      )}
    </View>
  );
});
