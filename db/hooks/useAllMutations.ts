import { db } from "@/db/client";
import { addToUserDeeds, removeFromUserDeeds } from "@/db/repos/allMutations";
import { dailyLogs, userDeeds } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { and, eq, sql } from "drizzle-orm";
import { getDeedStreak } from "../repos/allRequest";

export const useToggleDeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deedId,
      isAdded,
    }: {
      deedId: number;
      isAdded: boolean;
    }) => {
      if (isAdded) {
        await removeFromUserDeeds(deedId);
        return { deedId, newStatus: false };
      } else {
        await addToUserDeeds(deedId);
        return { deedId, newStatus: true };
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deeds"] });
      queryClient.invalidateQueries({ queryKey: ["daily-plan"] });
      queryClient.invalidateQueries({ queryKey: ["user-deeds"] });
    },
  });
};

export const useToggleDailyLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deedId,
      date,
      currentStatus,
      points,
    }: {
      deedId: number;
      date: string;
      currentStatus: boolean;
      points: number;
    }) => {
      if (currentStatus) {
        await db
          .update(dailyLogs)
          .set({ isCompleted: 0, earnedPoints: 0 })
          .where(and(eq(dailyLogs.deedId, deedId), eq(dailyLogs.date, date)));
      } else {
        // TİK AT
        await db
          .insert(dailyLogs)
          .values({
            deedId,
            date,
            isCompleted: 1,
            earnedPoints: points,
            isIntended: 1,
          })
          .onConflictDoUpdate({
            target: [dailyLogs.deedId, dailyLogs.date],
            set: { isCompleted: 1, earnedPoints: points },
          });

        // --- 2. STREAK VE LEVEL KONTROLÜ (Sadece Tik Atıldığında) ---
        // Yeni streak durumunu hesapla
        const newStreak = await getDeedStreak(deedId);

        // 21 ve katlarını bul (21, 42, 63...)
        const milestoneReached = Math.floor(newStreak / 21) * 21;

        if (milestoneReached > 0) {
          // Bu barem daha önce geçilmediyse Level'ı artır
          await db
            .update(userDeeds)
            .set({
              level: sql`${userDeeds.level} + 1`,
              lastMilestone: milestoneReached,
            })
            .where(
              and(
                eq(userDeeds.deedId, deedId),
                sql`${userDeeds.lastMilestone} < ${milestoneReached}`,
              ),
            );
        }
      }

      return { deedId, date, newStatus: !currentStatus, points };
    },

    onMutate: async ({ deedId, date, currentStatus, points }) => {
      await queryClient.cancelQueries({ queryKey: ["daily-plan", date] });
      await queryClient.cancelQueries({ queryKey: ["total-points"] });

      const previousPlan = queryClient.getQueryData(["daily-plan", date]);
      const previousPoints = queryClient.getQueryData(["total-points"]);

      queryClient.setQueryData(
        ["daily-plan", date],
        (old: any[] | undefined) => {
          if (!old) return [];
          return old.map((item) =>
            item.deedId === deedId
              ? { ...item, isCompleted: !currentStatus ? 1 : 0 }
              : item,
          );
        },
      );

      // UI'daki Toplam Puanı Güncelle
      queryClient.setQueryData(["total-points"], (oldPoints: number = 0) => {
        return !currentStatus ? oldPoints + points : oldPoints - points;
      });

      return { previousPlan, previousPoints };
    },

    // Hata durumunda UI'ı eski veriye geri döndür
    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          ["daily-plan", variables.date],
          context.previousPlan,
        );
        queryClient.setQueryData(["total-points"], context.previousPoints);
      }
      console.error("İşlem başarısız:", err);
    },

    // Her durumda veriyi arka planda tazele
    onSettled: (data, error, variables) => {
      // Günlük planı ve streak bilgisini invalidate et (arka planda güncellensinler)
      queryClient.invalidateQueries({
        queryKey: ["daily-plan", variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["deed-streak", variables.deedId],
      });
      // Seviye bilgisini içeren user-deeds listesini de tazele
      queryClient.invalidateQueries({ queryKey: ["user-deeds"] });
    },
  });
};
