import { useMutation, useQueryClient } from "@tanstack/react-query";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { addToUserDeeds, removeFromUserDeeds } from "../repos/allMutations";
import { dailyLogs } from "../schema";

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

    onMutate: async ({ deedId, isAdded }) => {
      // 1. İlgili sorguları iptal et (çakışmayı önle)
      await queryClient.cancelQueries({ queryKey: ["deeds"] });
      await queryClient.cancelQueries({ queryKey: ["user-deeds"] });

      // 2. Önceki veriyi sakla (Hata olursa geri dönmek için)
      const previousDeeds = queryClient.getQueryData(["deeds"]);

      // 3. Yeni durum (Tersi)
      const nextIsAdded = !isAdded;

      // 4. Cache'i manuel güncelle (Optimistic Update)
      queryClient.setQueriesData({ queryKey: ["deeds"] }, (oldData: any) => {
        if (!oldData) return oldData;

        // A) Eğer veri düz bir Array ise (useQuery)
        if (Array.isArray(oldData)) {
          return oldData.map((deed) =>
            deed.id === deedId
              ? { ...deed, isAdded: nextIsAdded ? 1 : 0 }
              : deed,
          );
        }

        // B) Eğer veri Sayfalı ise (useInfiniteQuery - pages yapısı varsa)
        if (oldData.pages && Array.isArray(oldData.pages)) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any[]) =>
              page.map((deed) =>
                deed.id === deedId
                  ? { ...deed, isAdded: nextIsAdded ? 1 : 0 }
                  : deed,
              ),
            ),
          };
        }

        return oldData;
      });

      return { previousDeeds };
    },

    onError: (err, vars, context) => {
      // Hata durumunda eski listeyi geri yükle
      if (context?.previousDeeds) {
        queryClient.setQueryData(["deeds"], context.previousDeeds);
      }
    },

    onSuccess: () => {
      // İşlem başarılı olduğunda her şeyi tazelemek en garantisi
      // Özellikle veritabanındaki ID'ler veya tarih alanları değiştiği için
      queryClient.invalidateQueries({ queryKey: ["deeds"] });
      queryClient.invalidateQueries({ queryKey: ["user-deeds"] });
      queryClient.invalidateQueries({ queryKey: ["daily-plan"] });
    },
  });
};
export const useToggleDailyLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deedId,
      date,
      currentStatus, // true ise tamamlanmış demektir, false yapacağız
      points,
    }: {
      deedId: number;
      date: string;
      currentStatus: boolean;
      points: number;
    }) => {
      // 1. Durum: Zaten yapılmışsa -> Geri Al (Sil veya 0 yap)
      if (currentStatus) {
        await db
          .update(dailyLogs)
          .set({ isCompleted: 0, earnedPoints: 0 })
          .where(and(eq(dailyLogs.deedId, deedId), eq(dailyLogs.date, date)));

        return { deedId, date, newStatus: false };
      }
      // 2. Durum: Yapılmamışsa -> Yapıldı İşaretle
      else {
        await db
          .insert(dailyLogs)
          .values({
            deedId,
            date,
            isCompleted: 1,
            earnedPoints: points,
            isIntended: 0,
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
      // 1. "daily-plan" sorgusunu durdur (Çakışma olmasın)
      const queryKey = ["daily-plan", date];
      await queryClient.cancelQueries({ queryKey });

      // 2. Eski veriyi sakla
      const previousData = queryClient.getQueryData(queryKey);

      // 3. Yeni durum (Tersi)
      const nextIsCompleted = !currentStatus;

      // 4. Cache'i güncelle
      queryClient.setQueryData(queryKey, (old: any[] | undefined) => {
        if (!old) return [];

        return old.map((item) => {
          // Listede ilgili ameli bul (deedId üzerinden)
          if (item.deedId === deedId) {
            return {
              ...item,
              isCompleted: nextIsCompleted ? 1 : 0, // UI güncellemesi
            };
          }
          return item;
        });
      });

      return { previousData, queryKey };
    },

    onError: (err, variables, context) => {
      // Hata olursa eski veriyi geri yükle
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },

    onSuccess: (data, variables) => {
      // İşlem bitince garantilemek için veriyi tazele
      // Sadece o günün planını yenilemek yeterli
      queryClient.invalidateQueries({
        queryKey: ["daily-plan", variables.date],
      });

      // Eğer ana sayfada puan kartı varsa onu da yenile
      queryClient.invalidateQueries({ queryKey: ["dailyPoints"] });
    },
  });
};
