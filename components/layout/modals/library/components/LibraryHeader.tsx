/* components/library/LibraryHeader.tsx */
import { AccordionFilter } from "@/components/layout/modals/library/AccordionFilter";
import { Text } from "@/components/ui/text";
import { withOpacity } from "@/theme/colors";
import { Spacing, Typography } from "@/theme/globals";
import { useColors } from "@/theme/useColors";
import { XCircle } from "lucide-react-native";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { UpdateBadge } from "./UpdateBadge";

// Props tiplerini tanımlıyoruz
interface LibraryHeaderProps {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  statusCounts: Record<number, number>;
  statuses: any[];
  categories: any[];
  periods: any[];
  totalCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const LibraryHeader = memo((props: LibraryHeaderProps) => {
  const { text, textMuted, destructive } = useColors();
  const {
    filters,
    setFilters,
    statusCounts,
    statuses,
    categories,
    periods,
    totalCount,
    hasActiveFilters,
    onClearFilters,
  } = props;

  return (
    <View style={styles.headerTopPadding}>
      {/* Filtreleme Componenti */}
      <AccordionFilter
        counts={statusCounts}
        search={filters.search}
        onSearchChange={(v) => setFilters((f: any) => ({ ...f, search: v }))}
        isLiveOnly={filters.isLiveOnly}
        onToggleLive={() =>
          setFilters((f: any) => ({ ...f, isLiveOnly: !f.isLiveOnly }))
        }
        statuses={statuses}
        selectedStatus={filters.status}
        onSelectStatus={(v) => setFilters((f: any) => ({ ...f, status: v }))}
        categories={categories}
        selectedCategory={filters.category}
        onSelectCategory={(v) =>
          setFilters((f: any) => ({ ...f, category: v }))
        }
        periods={periods}
        selectedPeriod={filters.period}
        onSelectPeriod={(v) => setFilters((f: any) => ({ ...f, period: v }))}
      />

      {/* Başlık ve Aksiyon Butonları Satırı */}
      <View style={styles.listHeaderRow}>
        <View style={styles.countInfo}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            {filters.isLiveOnly ? "Şu An" : "Kütüphane"}
          </Text>
          <Text style={[styles.countText, { color: textMuted }]}>
            ({totalCount})
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {hasActiveFilters && (
            <TouchableOpacity
              onPress={onClearFilters}
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

          <UpdateBadge />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerTopPadding: { paddingTop: Spacing.md },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  countInfo: { flexDirection: "row", alignItems: "center" },
  sectionTitle: { fontSize: Typography.body, fontWeight: "bold" },
  countText: { marginLeft: 6, fontSize: Typography.subtext },
  actionButtons: { flexDirection: "row", gap: Spacing.sm },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnText: { marginLeft: 4, fontSize: 12, fontWeight: "600" },
});
