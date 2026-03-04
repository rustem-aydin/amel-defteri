import { View } from "@/components/ui/view";
import { getAmelStatus, IslamicTimeState } from "@/hooks/useTimeEngine";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { DeedCard } from "./DeedCard";
import { DeedListEmpty } from "./DeedListEmpty";

interface DeedItemsListProps {
  data: any[];
  engine: IslamicTimeState | null; // useTimeEngine'den gelen tam state
  selectedHijriDate: string;
  ListHeaderComponent?: React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * 1. Dini Öncelik Puanı
 * Değer ne kadar küçükse liste o kadar yukarıda yer alır.
 */
const getReligiousWeight = (statusName: string | null): number => {
  if (!statusName) return 5000;
  const s = statusName.toUpperCase().trim();

  if (s === "FARZ") return 1000;
  if (s === "VACİP" || s === "VACIP" || s === "WAJIB") return 2000;
  if (s === "SÜNNET" || s === "SUNNAH") return 3000;
  if (s === "NAFİLE" || s === "NAFILE") return 4000;

  return 5000;
};

export const DeedItemsList = ({
  data,
  engine,
  selectedHijriDate,
  ListHeaderComponent,
}: DeedItemsListProps) => {
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const mapped = data.map((item) => {
      // SADECE DİNİ ÖNCELİK PUANI (Statü Sıralaması)
      // Tamamlanma veya vakit durumu sıralamayı etkilemez.
      const religiousScore = getReligiousWeight(item?.statusName);

      return { item, totalScore: religiousScore };
    });

    // Puanlara göre küçükten büyüğe sırala (Farz=1000, Vacip=2000 ...)
    mapped.sort((a, b) => a.totalScore - b.totalScore);

    return mapped.map((x) => x.item);
  }, [data]);

  // Render fonksiyonu
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<any>) => {
      // DeedCard'ın içine engine'i veya references'ı gönderiyoruz
      return (
        <DeedCard
          engine={engine}
          item={item}
          displayDate={selectedHijriDate}
        />
      );
    },
    [engine, selectedHijriDate],
  );

  // Liste değiştikçe FlashList'in doğru render olması için key
  const keyExtractor = useCallback(
    (item: any) => `${item.userDeedId}-${selectedHijriDate}`,
    [selectedHijriDate],
  );

  const renderHeader = useCallback(() => {
    if (!ListHeaderComponent) return null;
    return <View style={styles.headerWrapper}>{ListHeaderComponent}</View>;
  }, [ListHeaderComponent]);

  return (
    <View style={styles.container}>
      <FlashList<any>
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={DeedListEmpty}
        // @ts-ignore
        estimatedItemSize={100} // Performans için yaklaşık yükseklik
        drawDistance={500}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Akıcı kaydırma için
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 2,
  },
  headerWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 120, // Tab bar'ın altında kalmaması için
  },
});
