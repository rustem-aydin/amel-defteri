import { DeedActivityHeatmap } from "@/components/layout/modals/deed-details/components/DeedActivityHeatmap";
import DeedDetailsHeader from "@/components/layout/modals/deed-details/components/DeedDetailsHeader";
import { DetailsStatistic } from "@/components/layout/modals/deed-details/components/DeedDetailsStatisticCard";
import DeedStatusCards from "@/components/layout/modals/deed-details/components/DeedResourcesCards";
import { ParallaxScrollView } from "@/components/ui/parallax-scrollview";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useDailyPlan, useDeed } from "@/db/hooks/useAllQueries";
import { getCurrentHijriDate } from "@/helpers/hijriUtils";
import { useAppStore } from "@/store/useAppStore";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

export default function DeedDetailScreen() {
  const { id } = useLocalSearchParams();
  const deedId = id ? Number(id) : 0;
  const { data } = useDeed(deedId);

  // 🌙 Global Hicri Tarih State'i
  const selectedHijriDate = useAppStore((s) => s.selectedHijriDate);
  // Seçili tarih yoksa bugünü baz al
  const displayDate = selectedHijriDate || getCurrentHijriDate();

  // 📅 Seçili günün planını çek (Performanslı, cached)
  const { data: dailyData = [] } = useDailyPlan(displayDate);

  // Bu amelin o günkü durumunu bul
  const dayDeed = useMemo(
    () => dailyData.find((d) => d.deedId === deedId),
    [dailyData, deedId],
  );

  if (!data) return null;

  return (
    <ParallaxScrollView
      headerHeight={260}
      showBackButton
      headerImage={
        <DeedDetailsHeader
          categoryName={String(data?.categoryName)}
          periodTitle={String(data?.periodTitle)}
          color={String(data?.colorCode)}
          type={String(data?.statusName)}
          title={String(data?.title)}
          description={String(data?.description)}
        />
      }
    >
      <View style={{ gap: 16 }}>
        {/* Üst Bilgi ve Aksiyon Butonu */}

        <View>
          <Text variant="title">Fazileti</Text>
          <Text>{data?.virtueText}</Text>
        </View>

        <DeedStatusCards resources={data?.resources} />
        {data?.isAdded && (
          <View
            style={{
              borderTopWidth: 0.5,
              borderTopColor: "#e5e7eb",
              paddingTop: 16,
              marginTop: 16,
              alignItems: "center",
            }}
          >
            <Text
              variant="caption"
              style={{ color: "#9ca3af", marginBottom: 12 }}
            >
              {data?.title} İstatistikleri
            </Text>

            <DetailsStatistic
              id={deedId}
              level={data?.level}
              deedPoints={data?.deedPoints}
            />
            <DeedActivityHeatmap id={deedId} />
          </View>
        )}
      </View>
    </ParallaxScrollView>
  );
}
