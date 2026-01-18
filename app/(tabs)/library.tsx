import { useLocalSearchParams } from "expo-router";
import { RefreshCw, XCircle } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccordionFilter } from "@/components/library/AccordionFilter";
import { DeedCard } from "@/components/library/organisms/DeedCard";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";

import { useTimeEngine } from "@/hooks/useTimeEngine";
import { syncAllData } from "@/services/syncService";
import { useLocationStore } from "@/store/useLocationStore";
import { withOpacity } from "@/theme/colors";
import { Spacing, Typography } from "@/theme/globals";

import {
  useCategories,
  useDeeds,
  usePeriods,
  useStatuses,
} from "@/db/hooks/useAllQueries";
import { useColors } from "@/theme/useColors";

export default function LibraryScreen() {
  const params = useLocalSearchParams();
  const { success, error: toastError } = useToast();

  const coords = useLocationStore((state) => state.coords);
  const references = useTimeEngine(coords);
  const { background, primary, text, textMuted, destructive } = useColors();

  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: null as string | null,
    category: "Tümü",
    period: "Tümü",
    isLiveOnly: params.live === "true",
  });

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

  const { data: dbDeeds = [], isLoading, refetch } = useDeeds(queryFilters);

  const { data: statuses = [] } = useStatuses();
  const { data: categories = [] } = useCategories();
  const { data: periods = [] } = usePeriods();
  useEffect(() => {
    const checkAndSync = async () => {
      if (isLoading) return;
      if (
        dbDeeds.length === 0 &&
        !filters.search &&
        filters.category === "Tümü"
      ) {
        await handleRefresh();
      }
    };
    checkAndSync();
  }, [isLoading]);

  const handleRefresh = async () => {
    setIsManualSyncing(true);
    try {
      const res = await syncAllData();
      if (res?.status === "SUCCESS") {
        await refetch();
        success("Başarılı", "Veriler güncellendi");
      } else {
        toastError("Hata", "Güncelleme başarısız: " + res.message);
      }
    } catch (e) {
      toastError("Hata", "Beklenmedik bir hata oluştu");
    } finally {
      setIsManualSyncing(false);
    }
  };

  const statusCounts = useMemo(() => {
    const c: Record<number, number> = {};
    dbDeeds.forEach((d) => {
      if (d.statusId) c[d.statusId] = (c[d.statusId] || 0) + 1;
    });
    return c;
  }, [dbDeeds]);

  const finalData = useMemo(() => {
    if (!filters.isLiveOnly) return dbDeeds;

    return dbDeeds.filter((d) => {
      return !(d.startRef && d.endRef);
    });
  }, [dbDeeds, filters.isLiveOnly]);
  // Liste Optimizasyonları
  const getItemLayout = useCallback(
    (_: any, index: number) => ({ length: 84, offset: 84 * index, index }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <DeedCard
        item={item}
        index={index}
        isLiveMode={filters.isLiveOnly}
        references={references}
      />
    ),
    [filters.isLiveOnly, references],
  );

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerTopPadding}>
        <AccordionFilter
          counts={statusCounts}
          search={filters.search} // Anlık input değeri
          onSearchChange={(v) => setFilters((f) => ({ ...f, search: v }))}
          isLiveOnly={filters.isLiveOnly}
          onToggleLive={() =>
            setFilters((f) => ({ ...f, isLiveOnly: !f.isLiveOnly }))
          }
          statuses={statuses}
          selectedStatus={filters.status}
          onSelectStatus={(v) => setFilters((f) => ({ ...f, status: v }))}
          categories={categories}
          selectedCategory={filters.category}
          onSelectCategory={(v) => setFilters((f) => ({ ...f, category: v }))}
          periods={periods}
          selectedPeriod={filters.period}
          onSelectPeriod={(v) => setFilters((f) => ({ ...f, period: v }))}
        />

        <View style={styles.listHeaderRow}>
          <View style={styles.countInfo}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              {filters.isLiveOnly ? "Şu An" : "Kütüphane"}
            </Text>
            <Text style={[styles.countText, { color: textMuted }]}>
              ({finalData.length})
            </Text>
          </View>

          <View style={styles.actionButtons}>
            {(filters.status ||
              filters.search ||
              filters.category !== "Tümü" ||
              filters.period !== "Tümü") && (
              <TouchableOpacity
                onPress={() =>
                  setFilters({
                    search: "",
                    status: null,
                    category: "Tümü",
                    period: "Tümü",
                    isLiveOnly: false,
                  })
                }
                style={[
                  styles.clearBtn,
                  { backgroundColor: withOpacity(destructive, 0.1) },
                ]}
              >
                <XCircle size={14} color={destructive} />
                <Text style={[styles.btnText, { color: destructive }]}>
                  Temizle
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleRefresh}
              disabled={isManualSyncing}
              style={[
                styles.refreshBtn,
                { backgroundColor: withOpacity(primary, 0.1) },
              ]}
            >
              {isManualSyncing ? (
                <ActivityIndicator size={14} color={primary} />
              ) : (
                <>
                  <RefreshCw size={14} color={primary} />
                  <Text style={[styles.btnText, { color: primary }]}>
                    Yenile
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [
      statusCounts,
      filters,
      finalData.length,
      isManualSyncing,
      statuses,
      categories,
      periods,
      text,
      textMuted,
      primary,
      destructive,
    ],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <FlatList
        data={finalData}
        keyExtractor={(item) => `deed-${item.id}`}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === "android"}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
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
      />
    </SafeAreaView>
  );
}

// --- Custom Hooks & Helpers ---

// Basit Debounce Hook'u (Harici paket kurmamak için)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200, // Empty state için yükseklik
  },
  headerTopPadding: {
    paddingTop: Spacing.md,
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  countInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: Typography.body,
    fontWeight: "bold",
  },
  countText: {
    marginLeft: 6,
    fontSize: Typography.subtext,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 100,
  },
});
