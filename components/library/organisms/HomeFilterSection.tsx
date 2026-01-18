// components/home/organisms/HomeFilterSection.tsx
import { CategoryFilterList } from "@/components/library/CategoryFilterList";
import { StatusFilterList } from "@/components/library/StatusFilterList";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  isOpen: boolean;
  statuses: any[];
  categories: any[];
  filters: { status: string | null; category: string };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

export const HomeFilterSection = ({
  isOpen,
  statuses,
  categories,
  filters,
  setFilters,
}: Props) => {
  if (!isOpen) return null;

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      exit={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      style={styles.filterSection}
    >
      <StatusFilterList
        statuses={statuses}
        selected={filters.status}
        onSelect={(v) => setFilters((f: any) => ({ ...f, status: v }))}
        hideCount
      />
      <View style={{ height: 10 }} />
      <CategoryFilterList
        categories={categories}
        selected={filters.category}
        onSelect={(v) => setFilters((f: any) => ({ ...f, category: v }))}
      />
    </MotiView>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    paddingHorizontal: 0,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
});
