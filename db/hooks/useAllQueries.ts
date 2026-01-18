// hooks/use-queries.ts

import {
  getCategories,
  getDailyLogs,
  getDeed,
  getDeedHistory,
  getDeedResources,
  getDeeds,
  getDeedStatus,
  getPeriods,
  getStatuses,
  getUserDeeds,
  getUserProfile,
} from "@/db/repos/allRequest"; // Önceki adımda oluşturduğumuz dosya
import { useQuery } from "@tanstack/react-query";

export const useDeeds = (filters: {
  search?: string;
  status?: string | null;
  category?: string;
  period?: string;
}) => {
  return useQuery({
    queryKey: ["deeds", filters],
    queryFn: () => getDeeds(filters),
  });
};
/**
 * Tek bir amelin detayını getirir
 */
export const useDeed = (id: number) => {
  return useQuery({
    queryKey: ["deed-static", id], // Key değişti: deed-static
    queryFn: () => getDeed(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 Saat boyunca taze kabul et (DB'ye gitmez)
  });
};

export const useDeedStatus = (id: number) => {
  return useQuery({
    queryKey: ["deed-status", id], // Key: deed-status
    queryFn: () => getDeedStatus(id),
    enabled: !!id,
    // staleTime vermiyoruz, varsayılan olarak 0 (her zaman taze veri ister)
  });
};
/**
 * Kategorileri getirir
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity, // Kategoriler nadiren değişir
  });
};

export const usePeriods = () => {
  return useQuery({
    queryKey: ["resources"],
    queryFn: getPeriods,
    staleTime: Infinity, // Kategoriler nadiren değişir
  });
};
/**
 * Durumları (Farz, Sünnet vb.) getirir
 */
export const useStatuses = () => {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
    staleTime: Infinity,
  });
};

/**
 * Bir amelin kaynaklarını (Ayet/Hadis) getirir
 */
export const useDeedResources = (deedId: number) => {
  return useQuery({
    queryKey: ["deed-resources", deedId],
    queryFn: () => getDeedResources(deedId),
    enabled: !!deedId,
  });
};

// ==========================================
// 2. KULLANICI & TAKVİM HOOKLARI
// ==========================================

/**
 * Kullanıcının belirli bir tarihteki ABONELİKLERİNİ getirir.
 * (Henüz gün filtresi uygulanmamış ham liste)
 */
export const useUserDeeds = (date: string) => {
  return useQuery({
    queryKey: ["user-deeds", date],
    queryFn: () => getUserDeeds(date),
  });
};

export const useDailyLogs = (date: string, deedIds: number[]) => {
  return useQuery({
    queryKey: ["daily-logs", date, deedIds], // deedIds değişirse tekrar çeker
    queryFn: () => getDailyLogs(date, deedIds),
    enabled: deedIds.length > 0, // ID listesi boşsa sorgu atma
  });
};

/**
 * İstatistik: Bir amelin geçmiş loglarını getirir
 */
export const useDeedHistory = (deedId: number) => {
  return useQuery({
    queryKey: ["deed-history", deedId],
    queryFn: () => getDeedHistory(deedId),
    enabled: !!deedId,
  });
};

/**
 * Kullanıcı Profilini Getirir (Puan, Seviye)
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });
};

// ==========================================
// 3. COMPOSITE HOOK (AKILLI TAKVİM HOOKU)
// ==========================================

/*
  BURASI ÖNEMLİ:
  React Component içinde "Abonelikleri Çek" -> "Güne Göre Filtrele" -> "Logları Çek"
  zincirini tek seferde yöneten "Custom Hook". 
  
  Sayfanda sadece bunu kullanman yeterli olacaktır.
*/

// Basit bir filtreleme fonksiyonu (Daha önce konuştuğumuz mantık)
// Bunu utils/date-helpers.ts gibi bir yere de taşıyabilirsin.
const filterDeedsByPeriod = (userDeeds: any[], dateStr: string) => {
  const dateObj = new Date(dateStr);
  const dayOfWeek = dateObj.getDay(); // 0: Pazar, 1: Pzt...

  return userDeeds.filter((item) => {
    const code = item.periodCode; // userDeeds sorgusundan gelen veri

    switch (code) {
      case "DAILY":
        return true;
      case "WEEKLY_FRI":
        return dayOfWeek === 5;
      case "WEEKLY_MON_THU":
        return dayOfWeek === 1 || dayOfWeek === 4;
      // Diğer özel günler buraya eklenebilir...
      default:
        return true; // Bilinmeyenleri göster (güvenli taraf)
    }
  });
};

export const useDailyPlan = (date: string) => {
  // 1. O tarihteki aktif abonelikleri çek
  const {
    data: allUserDeeds,
    isLoading: isLoadingDeeds,
    error: errorDeeds,
  } = useUserDeeds(date);

  // 2. Gelen listeyi o güne (Pzt, Salı vb.) göre filtrele
  // useQuery sonucu gelmeden filtreleme yapma
  const todaysDeeds = allUserDeeds
    ? filterDeedsByPeriod(allUserDeeds, date)
    : [];

  // 3. Filtrelenmiş amellerin ID'lerini çıkar
  const deedIds = todaysDeeds.map((d) => d.deedId);

  // 4. Bu ID'ler için Logları çek
  const {
    data: logs,
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
  } = useDailyLogs(date, deedIds);

  // 5. Verileri Birleştir (UI için hazır hale getir)
  // Her amelin yanına o günkü log durumunu ekle
  const combinedData = todaysDeeds.map((deed) => {
    const log = logs?.find((l: any) => l.deedId === deed.deedId);
    return {
      ...deed,
      isCompleted: log?.isCompleted ?? 0,
      logId: log?.id, // Update işlemi için lazım olabilir
    };
  });

  return {
    data: combinedData,
    isLoading: isLoadingDeeds || isLoadingLogs,
    error: errorDeeds,
    refetch: refetchLogs,
  };
};
