import { ProgressStatsCard } from "@/components/layout/modals/library/components/ProgressStatsCard";
import { useDailyPlan } from "@/db/hooks/useAllQueries";
import { getCurrentHijriDate } from "@/helpers/hijriUtils";
import { useAppStore } from "@/store/useAppStore";
import React, { useMemo } from "react";
import { View } from "react-native";
import { NextDayCountdown } from "./NextDayCountdown";

export const StatsSection = () => {
  const selectedHijriDate = useAppStore((s) => s.selectedHijriDate);
  const safeDate = selectedHijriDate || getCurrentHijriDate();

  const { data: dailyData = [], isLoading } = useDailyPlan(safeDate);

  const stats = useMemo(() => {
    return dailyData.reduce(
      (acc: any, item: any) => {
        acc.total += 1;

        if (item.isCompleted) {
          acc.completed += 1;
          acc.points += item.earnedPoints ?? item.deedPoints ?? 0;
        }

        return acc;
      },
      { total: 0, completed: 0, points: 0, progressValue: 0 },
    );
  }, [dailyData]);

  stats.progressValue =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <View>
      <ProgressStatsCard
        completed={stats.completed}
        total={stats.total}
        points={stats.points}
        progressValue={stats.progressValue}
        isLoading={isLoading}
      />
      <NextDayCountdown />
    </View>
  );
};
