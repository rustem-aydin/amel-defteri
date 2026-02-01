import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DeedCard } from "@/components/layout/modals/library/components/DeedCard";
import { LibraryHeader } from "@/components/layout/modals/library/Header/LibraryHeader";
import { Text } from "@/components/ui/text";
import { useDeeds } from "@/db/hooks/useAllQueries";
import { useAppStore } from "@/store/useAppStore";
import { useColors } from "@/theme/useColors";
import { DeedItem } from "@/types/DeedItem";

const MemoizedDeedCard = React.memo(DeedCard);

export default function LibraryScreen() {
  const params = useLocalSearchParams();
  const { background, primary, textMuted } = useColors();

  const filters = useAppStore((state) => state.filters);
  const setFilters = useAppStore((state) => state.setFilters);

  useEffect(() => {
    if (params.live === "true") {
      setFilters({ isLiveOnly: true });
    }
  }, [params.live, setFilters]);

  const debouncedSearch = useDebounce(filters.search, 500);

  const queryFilters = useMemo(
    () => ({
      search: debouncedSearch,
      status: filters.status,
      category: filters.category,
      period: filters.period,
    }),
    [debouncedSearch, filters.status, filters.category, filters.period],
  );

  const { data: dbDeeds = [], isLoading } = useDeeds(queryFilters);

  const statusCounts = useMemo(() => {
    const c: Record<number, number> = {};
    for (const d of dbDeeds) {
      if (d.statusId) c[d.statusId] = (c[d.statusId] || 0) + 1;
    }
    return c;
  }, [dbDeeds]);

  const finalData = useMemo(() => {
    if (!filters.isLiveOnly) return dbDeeds;
    return dbDeeds.filter((d: any) => !(d.startRef && d.endRef));
  }, [dbDeeds, filters.isLiveOnly]);

  const renderItem = useCallback(
    ({ item, index }: { item: DeedItem; index: number }) => (
      <MemoizedDeedCard
        item={item}
        index={index}
        isLiveMode={filters.isLiveOnly}
      />
    ),
    [filters.isLiveOnly],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <FlashList
        data={finalData}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
        // @ts-ignore
        estimatedItemSize={140}
        ListHeaderComponent={
          <LibraryHeader
            statusCounts={statusCounts}
            totalCount={finalData.length}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.center}>
              <Text style={{ color: textMuted }}>
                {filters.search
                  ? `"${filters.search}" bulunamadı.`
                  : "Kayıt bulunamadı."}
              </Text>
            </View>
          ) : (
            <View style={styles.center}>
              <ActivityIndicator color={primary} />
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}

// Helper: Debounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200,
  },
});
