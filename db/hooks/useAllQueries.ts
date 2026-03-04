// hooks/use-queries.ts

import {
  calculateDeedTotalPoints,
  calculateTotalPoints,
  getCategories,
  getDeed,
  getDeedCompletedDates,
  getDeedHistory,
  getDeedResources,
  getDeeds,
  getDeedStatus,
  getDeedStreak,
  getEarliestActivityDate,
  getLibraryDashboardData,
  getPeriods,
  getStatuses,
  getUserDeeds,
} from "@/db/repos/allRequest";
import { useSyncStore } from "@/store/useSyncStore";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { addHijriDays } from "@/helpers/hijriUtils";
import { getDateAttributes } from "@/helpers/dateUtils";

export const useDeeds = (filters: any) => {
  const version = useSyncStore((s) => s.version);

  return useQuery({
    queryKey: ["deeds", filters, version],
    queryFn: async () => {
      console.log("🔍 getDeeds çalıştı - version:", version);
      const result = await getDeeds(filters);
      console.log("📊 Sonuç sayısı:", result.length);
      return result;
    },
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
};
export const useDeed = (id: number) => {
  return useQuery({
    queryKey: ["deed-static", id],
    queryFn: () => getDeed(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
};

export const useDeedStatus = (id: number) => {
  return useQuery({
    queryKey: ["deed-status", id],
    queryFn: () => getDeedStatus(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  });
};

export const usePeriods = () => {
  return useQuery({
    queryKey: ["periods"], // "resources" key'ini düzelttim
    queryFn: getPeriods,
    staleTime: Infinity,
  });
};

export const useStatuses = () => {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
    staleTime: Infinity,
  });
};

export const useDeedResources = (deedId: number) => {
  return useQuery({
    queryKey: ["deed-resources", deedId],
    queryFn: () => getDeedResources(deedId),
    enabled: !!deedId,
  });
};

// ==========================================
// 2. KULLANICI & TAKVİM HOOKLARI (HİCRİ SYSTEM)
// ==========================================

/**
 * 🔥 OPTİMİZE EDİLMİŞ GÜNLÜK PLAN (HİCRİ)
 * Tek bir SQL sorgusu ile her şeyi getirir.
 * Artık filtreleme SQL tarafında yapılıyor (getDateAttributes ile)
 */
export const useDailyPlan = (hijriDate: string) => {
  return useQuery({
    queryKey: ["daily-plan", hijriDate],
    queryFn: async () => {
      console.log(`🔍 [QUERY START] Günlük Plan Çekiliyor: '${hijriDate}'`);
      const data = await getUserDeeds(hijriDate);
      console.log(`📊 [QUERY RESULT] '${hijriDate}' için ${data.length} kayıt bulundu.`);

      // İlk kaydın durumunu logla (Örneklem)
      if (data.length > 0) {
         const doneCount = data.filter(d => d.isCompleted).length;
         console.log(`✅ Tamamlanan Amel Sayısı: ${doneCount}`);
         // Debug için ilk tamamlanan kaydı göster
         const firstDone = data.find(d => d.isCompleted);
         if (firstDone) {
            console.log(`Example Done Deed: ID=${firstDone.deedId}, isCompleted=${firstDone.isCompleted}, LogID=${firstDone.logId}`);
         }
      }
      return data;
    },
    staleTime: 0, // Debug için cache kapalı
  });
};

/**
 * 🚀 SİHİRLİ PRELOADER (HİCRİ)
 * Bunu ana sayfana ekle. Dünü ve Yarını arka planda yükler.
 */
export const useCalendarPreload = (currentHijriDate: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const datesToPreload = [
      addHijriDays(currentHijriDate, 1), // Yarın
      addHijriDays(currentHijriDate, -1), // Dün
    ];

    datesToPreload.forEach((hijriDate) => {
      // Eğer cache'de yoksa yükle
      const state = queryClient.getQueryState(["daily-plan", hijriDate]);
      if (!state?.data) {
        queryClient.prefetchQuery({
          queryKey: ["daily-plan", hijriDate],
          queryFn: async () => {
            const data = await getUserDeeds(hijriDate);
            return data;
          },
          staleTime: 1000 * 60 * 5,
        });
      }
    });
  }, [currentHijriDate, queryClient]);
};

// ==========================================
// 3. DİĞER HOOKLAR
// ==========================================

export const useDeedHistory = (deedId: number) => {
  return useQuery({
    queryKey: ["deed-history", deedId],
    queryFn: () => getDeedHistory(deedId),
    enabled: !!deedId,
  });
};

export const useCalculateTotalPoints = () => {
  return useQuery({
    queryKey: ["total-points"],
    queryFn: calculateTotalPoints,
  });
};

export const useStreak = (item_id: number) => {
  return useQuery({
    queryKey: ["deed-streak", item_id],
    queryFn: () => getDeedStreak(item_id),
    enabled: !!item_id,
  });
};

export const useEarliestActivityDate = () => {
  return useQuery({
    queryKey: ["first-date"],
    queryFn: getEarliestActivityDate,
  });
};

export const usecalculateDeedTotalPoints = (deedId: number) => {
  return useQuery({
    queryKey: ["calculated-deed", deedId],
    queryFn: () => calculateDeedTotalPoints(deedId),
    enabled: !!deedId,
  });
};

export const usegetDeedCompletedDates = (deedId: number) => {
  return useQuery({
    queryKey: ["deed-year-headmap", deedId],
    queryFn: () => getDeedCompletedDates(deedId),
    enabled: !!deedId,
  });
};

export const useLibraryDashboard = (startDate: string, endDate: string) => {
  const version = useSyncStore((s) => s.version);

  return useQuery({
    queryKey: ["library-dashboard", startDate, endDate, version],
    queryFn: () => getLibraryDashboardData(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5, // 5 dakika cache
  });
};
