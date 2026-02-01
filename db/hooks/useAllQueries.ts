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
// 2. KULLANICI & TAKVİM HOOKLARI (OPTIMIZED)
// ==========================================

// Yardımcı Fonksiyon: Gün Ekle/Çıkar
const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

// JS tarafında filtreleme (Haftanın günlerine göre)
const filterDeedsByPeriod = (userDeeds: any[], dateStr: string) => {
  const dateObj = new Date(dateStr);
  const dayOfWeek = dateObj.getDay(); // 0: Pazar, 1: Pzt...

  return userDeeds.filter((item) => {
    const code = item.periodCode;
    switch (code) {
      case "DAILY":
        return true;
      case "WEEKLY_FRI":
        return dayOfWeek === 5;
      case "WEEKLY_MON_THU":
        return dayOfWeek === 1 || dayOfWeek === 4;
      default:
        return true;
    }
  });
};

/**
 * 🔥 OPTİMİZE EDİLMİŞ GÜNLÜK PLAN
 * Tek bir SQL sorgusu ile her şeyi getirir.
 */
export const useDailyPlan = (date: string) => {
  return useQuery({
    queryKey: ["daily-plan", date],
    queryFn: async () => {
      const data = await getUserDeeds(date);
      // Log verileri zaten data'nın içinde (isCompleted, logId vs.)
      return filterDeedsByPeriod(data, date);
    },
    staleTime: 1000 * 60 * 2, // 2 dk cache (DB'yi rahatlatır)
  });
};

/**
 * 🚀 SİHİRLİ PRELOADER
 * Bunu ana sayfana ekle. Dünü ve Yarını arka planda yükler.
 */
export const useCalendarPreload = (currentDate: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const datesToPreload = [
      addDays(currentDate, 1), // Yarın
      addDays(currentDate, -1), // Dün
    ];

    datesToPreload.forEach((date) => {
      // Eğer cache'de yoksa yükle
      const state = queryClient.getQueryState(["daily-plan", date]);
      if (!state?.data) {
        queryClient.prefetchQuery({
          queryKey: ["daily-plan", date],
          queryFn: async () => {
            const data = await getUserDeeds(date);
            return filterDeedsByPeriod(data, date);
          },
          staleTime: 1000 * 60 * 5,
        });
      }
    });
  }, [currentDate, queryClient]);
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
