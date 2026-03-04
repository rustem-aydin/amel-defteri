import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";

import { AreaChartInteractive } from "@/components/layout/modals/stats/StatisticCard";
import { Badge } from "@/components/ui/badge";
import {
  HijriRangePicker,
  HijriRange,
} from "@/components/ui/hijri-range-picker";
import { ParallaxScrollView } from "@/components/ui/parallax-scrollview";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useLibraryDashboard } from "@/db/hooks/useAllQueries";
import {
  getCurrentHijriDate,
  parseHijriDate,
  getHijriMonthLength,
} from "@/helpers/hijriUtils";

const pad = (n: number) => String(n).padStart(2, "0");

export default function LibraryScreen() {
  // 1. Varsayılan: Mevcut Hicri yılın başından bugüne
  const [selectedRange, setSelectedRange] = useState<HijriRange>(() => {
    const today = getCurrentHijriDate();
    const { year } = parseHijriDate(today);
    return {
      startHijri: `${year}-01-01`,
      endHijri: today,
    };
  });

  // 2. Tek Sorgu: Dashboard verisini Hicri tarihlerle çek
  const { data, isLoading } = useLibraryDashboard(
    selectedRange.startHijri,
    selectedRange.endHijri,
  );

  return (
    <ParallaxScrollView
      headerHeight={240}
      showBackButton
      headerImage={
        <View style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            source={require("@/assets/images/stats.jpg")}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.9)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "80%",
            }}
          />
          <View style={{ position: "absolute", bottom: 20, left: 20 }}>
            <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
              {data?.stats.totalPoints ?? 0} Puan
            </Text>
            <Text style={{ color: "#ccc", fontSize: 16 }}>
              {data?.stats.completedCount ?? 0} Toplam Amel Kaydı
            </Text>
          </View>
        </View>
      }
    >
      <View style={{ gap: 24 }}>
        {/* Hicri Tarih Seçimi */}
        <HijriRangePicker
          label="Zaman Aralığı"
          value={selectedRange}
          onChange={setSelectedRange}
        />

        {/* Grafik Bölümü */}
        <AreaChartInteractive
          data={data?.chartData ?? []}
          loading={isLoading}
        />

        {/* Dinamik Skills (Kategoriler) Bölümü */}
        <View style={{ gap: 12 }}>
          <Text variant="title">En Güçlü Alanların</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {data?.topCategories.map((cat) => (
              <Badge variant="success" key={cat}>
                {cat}
              </Badge>
            ))}
            {data?.topCategories.length === 0 && (
              <Text variant="caption">Henüz veri toplanmamış.</Text>
            )}
          </View>
        </View>

        {/* İstatistik Detay Kartları */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f5f5f5",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <Text variant="caption">Toplam Amel</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {data?.stats.completedCount}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#f5f5f5",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <Text variant="caption">Genel Puan</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {data?.stats.totalPoints}
            </Text>
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}
