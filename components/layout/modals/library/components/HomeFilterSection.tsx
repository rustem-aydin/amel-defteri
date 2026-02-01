// components/home/organisms/HomeFilterSection.tsx
import { CategoryFilterList } from "@/components/layout/modals/library/CategoryFilterList";
import { StatusFilterList } from "@/components/layout/modals/library/StatusFilterList";
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
    <View style={styles.filterSection}>
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
    </View>
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
