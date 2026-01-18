import { useMutation, useQueryClient } from "@tanstack/react-query";
import { and, eq } from "drizzle-orm";
import { db } from "../client"; // Veritabanı bağlantınız
import { dailyLogs } from "../schema"; // Şema dosyanız

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
      // Eğer şu an tamamlanmışsa -> Tamamlanmadı yap (Puanı geri al)
      if (currentStatus) {
        await db
          .update(dailyLogs)
          .set({ isCompleted: 0, earnedPoints: 0 })
          .where(and(eq(dailyLogs.deedId, deedId), eq(dailyLogs.date, date)));

        return { deedId, date, newStatus: false };
      }
      // Eğer tamamlanmamışsa -> Tamamlandı yap (Puanı ekle)
      else {
        // Upsert: Varsa güncelle, yoksa ekle (Unique Index: deedId + date)
        await db
          .insert(dailyLogs)
          .values({
            deedId,
            date,
            isCompleted: 1,
            earnedPoints: points,
            isIntended: 0, // Varsayılan
          })
          .onConflictDoUpdate({
            target: [dailyLogs.deedId, dailyLogs.date],
            set: { isCompleted: 1, earnedPoints: points },
          });

        return { deedId, date, newStatus: true };
      }
    },

    // --- OPTIMISTIC UPDATE ---
    onMutate: async ({ deedId, date, currentStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["myDailyDeeds", date] });
      await queryClient.cancelQueries({ queryKey: ["dailyLog", deedId, date] });

      const previousMyDeeds = queryClient.getQueryData(["myDailyDeeds", date]);

      const nextIsCompleted = !currentStatus;

      queryClient.setQueryData(
        ["myDailyDeeds", date],
        (old: any[] | undefined) => {
          if (!old) return old;

          return old.map((item) => {
            // Listeden gelen 'id' veya 'deedId' hangisiyse onu kullanın.
            // useMyDailyDeeds sorgusunda 'id: deeds.id' demiştik.
            if (item.id === deedId) {
              return {
                ...item,
                isCompleted: nextIsCompleted ? 1 : 0, // 1 veya 0 (DB formatı)
              };
            }
            return item;
          });
        },
      );

      return { previousMyDeeds };
    },

    onError: (err, variables, context) => {
      if (context?.previousMyDeeds) {
        queryClient.setQueryData(
          ["myDailyDeeds", variables.date],
          context.previousMyDeeds,
        );
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user-deeds", data.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["myDailyDeeds", data.date],
      });
    },
  });
};
