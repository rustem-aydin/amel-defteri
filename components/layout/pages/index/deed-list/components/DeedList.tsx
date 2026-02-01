import { View } from "@/components/ui/view";
import { getAmelStatus } from "@/hooks/useTimeEngine";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { DeedCard } from "./DeedCard";
import { DeedListEmpty } from "./DeedListEmpty";

interface DeedItemsListProps {
  data: any[];
  references: any;
  selectedDate: string;
  ListHeaderComponent?: React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const getReligiousWeight = (statusName: string | null): number => {
  if (!statusName) return 5000;
  const s = statusName.toUpperCase().trim();
  if (s === "FARZ") return 1000;
  if (s === "VACİP" || s === "VACIP" || s === "WAJIB") return 2000;
  if (s === "SÜNNET" || s === "SUNNAH") return 3000;
  if (s === "NAFİLE" || s === "NAFILE") return 4000;

  return 5000;
};

const getTimeWeight = (status: string, isCompleted: boolean): number => {
  switch (status) {
    case "active":
      return 1;
    case "not_started":
      return 2;
    default:
      return 3;
  }
};

export const DeedItemsList = ({
  data,
  references,
  selectedDate,
  ListHeaderComponent,
}: DeedItemsListProps) => {
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const mapped = data.map((item) => {
      const { status } = getAmelStatus(
        references,
        item?.startRef,
        item?.endRef,
      );

      const religiousScore = getReligiousWeight(item?.statusName);

      const timeScore = getTimeWeight(status, !!item?.isCompleted);

      const totalScore = religiousScore + timeScore;

      return { item, totalScore };
    });

    mapped.sort((a, b) => a.totalScore - b.totalScore);

    return mapped.map((x) => x.item);
  }, [data, references]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<any>) => {
      return <DeedCard references={references} item={item} />;
    },
    [references],
  );

  const keyExtractor = useCallback(
    (item: any) => `${item.userDeedId}-${selectedDate}`,
    [selectedDate],
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={{ width: "100%", marginBottom: 16 }}>
        {ListHeaderComponent}
      </View>
    );
  }, [ListHeaderComponent]);
  return (
    <View style={{ flex: 1, minHeight: 2 }}>
      <FlashList<any>
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={DeedListEmpty}
        contentContainerStyle={[
          {
            paddingHorizontal: 16, // Kenarlardan boşluk (StatsSection için önemli)
            paddingTop: 10,
            paddingBottom: 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
