import { ProgressStatsCard } from "@/components/library/organisms/ProgressStatsCard";
import { useUserDeeds } from "@/db/hooks/useAllQueries";
// Karmaşık hook yerine direkt veritabanı sorgusunu çağıran hook'u kullan
import { useAppStore } from "@/store/useAppStore";
import React, { useMemo } from "react";

export const StatsSection = () => {
  const selectedDate = useAppStore((s) => s.selectedDate);

  const { data: dailyData = [], isLoading } = useUserDeeds(selectedDate);

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

  // Yüzdeyi hesapla (0'a bölünme hatasını önleyerek)
  stats.progressValue =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <ProgressStatsCard
      completed={stats.completed}
      total={stats.total}
      points={stats.points}
      progressValue={stats.progressValue}
      isLoading={isLoading} // Loading durumunu karta gönder
    />
  );
};
