import { db } from "@/db/client";
import { addToUserDeeds, removeFromUserDeeds, toggleDeedCompletion } from "@/db/repos/allMutations";
import { dailyLogs, userDeeds } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { and, eq, sql } from "drizzle-orm";
import { getDeedStreak } from "../repos/allRequest";
import { useSyncStore } from "@/store/useSyncStore";

export const useToggleDeed = () => {
  const queryClient = useQueryClient();
  const bumpVersion = useSyncStore((s) => s.bumpVersion);

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

    // 🚀 OPTIMISTIC UPDATE - UI anında güncellenir
    onMutate: async ({ deedId, isAdded }) => {
      await queryClient.cancelQueries({ queryKey: ["deeds"] });

      const previousDeeds = queryClient.getQueryData(["deeds"]);

      // Cache'deki veriyi hemen güncelle
      queryClient.setQueriesData(
        { queryKey: ["deeds"] },
        (old: any) => {
          if (!old) return old;
          return old.map((deed: any) =>
            deed.id === deedId
              ? { ...deed, isAdded: isAdded ? 0 : 1 } // Toggle
              : deed
          );
        }
      );

      return { previousDeeds };
    },

    onSuccess: () => {
      // 🔄 Version'ı artır
      bumpVersion();

      // 🔥 ANINDA REFETCH
      queryClient.refetchQueries({ queryKey: ["deeds"] });
      queryClient.refetchQueries({ queryKey: ["daily-plan"] });
      queryClient.refetchQueries({ queryKey: ["user-deeds"] });
    },

    // Hata durumunda geri al
    onError: (err, variables, context) => {
      if (context?.previousDeeds) {
        queryClient.setQueryData(["deeds"], context.previousDeeds);
      }
      console.error("Amel ekleme/çıkarma hatası:", err);
    },
  });
};

/**
 * 🌙 HİCRİ TAKVİM VERSİYONU
 * Artık date yerine hijriDate kullanıyor
 */
export const useToggleDailyLog = () => {
  const queryClient = useQueryClient();
  const bumpVersion = useSyncStore((s) => s.bumpVersion);

  return useMutation({
    mutationFn: async ({
      deedId,
      hijriDate,
      currentStatus,
      points,
    }: {
      deedId: number;
      hijriDate: string;
      currentStatus: boolean;
      points: number;
    }) => {
      console.log(`🔘 [MUTATION START] Deed: ${deedId}, Date: ${hijriDate}, OldStatus: ${currentStatus} -> New: ${!currentStatus}`);

      // ✅ toggleDeedCompletion kullan (Hicri + dual-date insert yapar)
      await toggleDeedCompletion(deedId, hijriDate, !currentStatus, points);

      console.log(`✅ [MUTATION DB DONE] Deed: ${deedId} işlemi tamamlandı.`);

      // Streak ve level kontrolü (sadece tik atıldığında)
      if (!currentStatus) {
        const newStreak = await getDeedStreak(deedId);
        const milestoneReached = Math.floor(newStreak / 21) * 21;

        if (milestoneReached > 0) {
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

      return { deedId, hijriDate, newStatus: !currentStatus, points };
    },

    onMutate: async ({ deedId, hijriDate, currentStatus, points }) => {
      await queryClient.cancelQueries({ queryKey: ["daily-plan", hijriDate] });
      await queryClient.cancelQueries({ queryKey: ["total-points"] });

      const previousPlan = queryClient.getQueryData(["daily-plan", hijriDate]);
      const previousPoints = queryClient.getQueryData(["total-points"]);

      queryClient.setQueryData(
        ["daily-plan", hijriDate],
        (old: any[] | undefined) => {
          if (!old) return [];
          return old.map((item) =>
            item.deedId === deedId
              ? {
                  ...item,
                  isCompleted: !currentStatus ? 1 : 0,
                  // Puanları da optimistik olarak güncelle
                  earnedPoints: !currentStatus ? points : 0
                }
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
      console.error("❌ [MUTATION ERROR]", err);
      if (context) {
        queryClient.setQueryData(
          ["daily-plan", variables.hijriDate],
          context.previousPlan,
        );
        queryClient.setQueryData(["total-points"], context.previousPoints);
      }
      console.error("İşlem başarısız:", err);
    },

    onSuccess: () => {
      // 🔄 Version'ı artır
      bumpVersion();

      // 🔥 ANINDA REFETCH - invalidate yerine refetch kullan
      queryClient.refetchQueries({ queryKey: ["daily-plan"] });
      queryClient.refetchQueries({ queryKey: ["total-points"] });
      queryClient.refetchQueries({ queryKey: ["deed-streak"] });
      queryClient.refetchQueries({ queryKey: ["user-deeds"] });
    },
  });
};
