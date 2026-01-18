import { Clock, Search, SlidersHorizontal } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

// Temalar & Hooklar
import { Sizes, Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";

// Alt Bileşenler (Bunların da içinde useColor kullandığından emin olmalısın)
import { CategoryFilterList } from "./CategoryFilterList";
import { PeriodFilterList } from "./PeriodFilterList";
import { StatusFilterList } from "./StatusFilterList";

interface AccordionFilterProps {
  search: string;
  onSearchChange: (text: string) => void;
  isLiveOnly: boolean;
  onToggleLive: () => void;
  counts: Record<number, number>;
  statuses: any[];
  selectedStatus: string | null;
  onSelectStatus: (val: string | null) => void;
  categories: any[];
  selectedCategory: string;
  onSelectCategory: (val: string) => void;
  periods: any[];
  selectedPeriod: string;
  onSelectPeriod: (val: string) => void;
}

export const AccordionFilter = (props: AccordionFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 1. TEMA RENKLERİ
  const backgroundColor = useColor("background");
  const cardBg = useColor("card");
  const textColor = useColor("text");
  const textMuted = useColor("textMuted");
  const primary = useColor("active"); // Genelde #10b981
  const primaryForeground = useColor("primaryForeground"); // Aktif ikon rengi (siyah veya beyaz)
  const borderColor = useColor("border");

  const hasActiveFilters =
    props.selectedStatus ||
    props.selectedCategory !== "Tümü" ||
    props.selectedPeriod !== "Tümü";

  const onToggleOpen = () => setIsOpen(!isOpen);

  return (
    <View style={styles.container}>
      {/* ÜST SATIR (Arama ve Butonlar) */}
      <View style={styles.headerRow}>
        <View
          style={[styles.searchBar, { backgroundColor: cardBg, borderColor }]}
        >
          <Search size={18} color={textMuted} />
          <TextInput
            placeholder="Kütüphanede ara..."
            placeholderTextColor={textMuted}
            style={[styles.input, { color: textColor }]}
            value={props.search}
            onChangeText={props.onSearchChange}
          />
        </View>

        <TouchableOpacity
          onPress={props.onToggleLive}
          style={[
            styles.iconBtn,
            { backgroundColor: cardBg, borderColor },
            props.isLiveOnly && {
              backgroundColor: primary,
              borderColor: primary,
            },
          ]}
        >
          <Clock
            size={20}
            color={props.isLiveOnly ? primaryForeground : textMuted}
          />
        </TouchableOpacity>

        {/* Detaylı Filtre Butonu */}
        <TouchableOpacity
          onPress={onToggleOpen}
          style={[
            styles.iconBtn,
            { backgroundColor: cardBg, borderColor },
            (isOpen || hasActiveFilters) && {
              backgroundColor: primary,
              borderColor: primary,
            },
          ]}
        >
          <SlidersHorizontal
            size={20}
            color={isOpen || hasActiveFilters ? primaryForeground : textMuted}
          />
        </TouchableOpacity>
      </View>

      <AnimatePresence>
        {isOpen && (
          <MotiView
            from={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "timing", duration: 300 }}
            style={styles.content}
          >
            <View
              style={[styles.separator, { backgroundColor: borderColor }]}
            />

            <PeriodFilterList
              periods={props.periods}
              selected={props.selectedPeriod}
              onSelect={props.onSelectPeriod}
            />
            <StatusFilterList
              statuses={props.statuses}
              selected={props.selectedStatus}
              onSelect={props.onSelectStatus}
              counts={props.counts}
            />
            <CategoryFilterList
              categories={props.categories}
              selected={props.selectedCategory}
              onSelect={props.onSelectCategory}
            />
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: Sizes.HEIGHT,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    height: "100%",
  },
  iconBtn: {
    width: Sizes.HEIGHT,
    height: Sizes.HEIGHT,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  content: {
    overflow: "hidden",
  },
  separator: {
    height: 1,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
});
