// components/home/FilterSection.tsx
import { useAppStore } from "@/store/useAppStore";
import React from "react";
// Bu hookların projenizde var olduğunu varsayıyorum (ilk kodunuzda vardılar)
// UI Bileşeni
import { HomeFilterSection } from "@/components/library/organisms/HomeFilterSection";
import { useCategories, useStatuses } from "@/db/hooks/useAllQueries";

export const FilterSection = () => {
  const isOpen = useAppStore((s) => s.isFilterOpen);
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);

  const { data: statuses = [] } = useStatuses();
  const { data: categories = [] } = useCategories();

  return (
    <HomeFilterSection
      isOpen={isOpen}
      statuses={statuses}
      categories={categories}
      filters={filters}
      setFilters={setFilters}
    />
  );
};
