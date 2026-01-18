// components/home/HomeHeaderSection.tsx
import { HomeHeader } from "@/components/library/organisms/HomeHeader";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";
import React from "react";

export const HomeHeaderSection = () => {
  const selectedDate = useAppStore((s) => s.selectedDate);
  const isLiveOnly = useAppStore((s) => s.isLiveOnly);
  const goToToday = useAppStore((s) => s.goToToday);
  const toggleLiveOnly = useAppStore((s) => s.toggleLiveOnly);
  const toggleFilterModal = useAppStore((s) => s.toggleFilterModal);

  const isToday = selectedDate === format(new Date(), "yyyy-MM-dd");

  return (
    <HomeHeader
      selectedDate={selectedDate}
      isToday={isToday}
      onGoToToday={goToToday}
      isLiveOnly={isLiveOnly}
      onToggleLive={toggleLiveOnly}
      onToggleFilter={toggleFilterModal}
    />
  );
};
