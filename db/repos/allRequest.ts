import {
  dailyLogs,
  deedCategories,
  deedPeriods,
  deedResources,
  deeds,
  deedStatuses,
  resources,
  userDeeds,
  userProfile,
} from "@/db/schema"; // Schema dosyan
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gt,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { db } from "../client";

// ==========================================
// 1. STATİK VERİ FONKSİYONLARI (LIBRARY)
// ==========================================

/**
 * Tüm amelleri, kategori, durum ve dönem bilgileriyle birlikte getirir.
 * "Kütüphane" sayfasında listelemek için idealdir.
 */
// db/queries.ts dosyasında importları güncelle
import { like } from "drizzle-orm";

// Filtre Tipi Tanımı
type DeedFilters = {
  search?: string;
  status?: string | null;
  category?: string;
  period?: string;
};

export const getDeeds = async (filters: DeedFilters = {}) => {
  let query = db
    .select({
      // 1. Amel tablosunun TÜM sütunlarını otomatik al
      // (Tek tek yazmak yerine spread operatörü kullanıyoruz)
      ...getTableColumns(deeds),

      // 2. İlişkili tabloları NESNE olarak al
      // Artık sadece "name" değil, "iconUrl", "id" hepsi gelecek.
      category: deedCategories, // Çıktı: { id: 1, name: "Namaz", iconUrl: "..." }
      status: deedStatuses, // Çıktı: { id: 1, name: "Farz", colorCode: "#f00" }
      period: deedPeriods, // Çıktı: { id: 1, code: "MORNING", title: "Sabah" }

      // 3. Özel Hesaplanan Alan (User Deed)
      isAdded: sql<boolean>`CASE WHEN ${userDeeds.id} IS NOT NULL THEN 1 ELSE 0 END`,
    })
    .from(deeds)
    .leftJoin(deedCategories, eq(deeds.categoryId, deedCategories.id))
    .leftJoin(deedStatuses, eq(deeds.statusId, deedStatuses.id))
    .leftJoin(deedPeriods, eq(deeds.periodId, deedPeriods.id))
    .leftJoin(
      userDeeds,
      and(eq(deeds.id, userDeeds.deedId), isNull(userDeeds.removedAt)),
    )
    .$dynamic();

  // --- FİLTRELEME KISMI AYNI ---
  const conditions = [];

  if (filters.search && filters.search.trim() !== "") {
    conditions.push(like(deeds.title, `%${filters.search}%`));
  }

  // Not: Artık nesne döndüğü için filtrelerde hala 'name' üzerinden kontrol edebiliriz
  if (filters.status) {
    conditions.push(eq(deedStatuses.name, filters.status));
  }

  if (filters.category && filters.category !== "Tümü") {
    conditions.push(eq(deedCategories.name, filters.category));
  }

  if (filters.period && filters.period !== "Tümü") {
    conditions.push(eq(deedPeriods.code, filters.period));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await query;
};

export const getDeed = async (deedId: number) => {
  const deedInfo = await db
    .select({
      id: deeds.id,
      title: deeds.title,
      description: deeds.description,
      virtueText: deeds.virtueText,
      intentionPoints: deeds.intentionPoints,
      deedPoints: deeds.deedPoints,
      statusName: deedStatuses.name,
      colorCode: deedStatuses.colorCode,
      categoryName: deedCategories.name,
      periodCode: deedPeriods.code,
    })
    .from(deeds)
    .leftJoin(deedStatuses, eq(deeds.statusId, deedStatuses.id))
    .leftJoin(deedCategories, eq(deeds.categoryId, deedCategories.id))
    .leftJoin(deedPeriods, eq(deeds.periodId, deedPeriods.id))
    .where(eq(deeds.id, deedId))
    .get();

  if (!deedInfo) return null;

  // Kaynaklar (Ayet/Hadis) - Bu da statiktir
  const deedResourcesData = await db
    .select({
      id: resources.id,
      type: resources.type,
      content: resources.content,
      sourceInfo: resources.sourceInfo,
    })
    .from(resources)
    .innerJoin(deedResources, eq(resources.id, deedResources.resourceId))
    .where(eq(deedResources.deedId, deedId));

  return {
    ...deedInfo,
    resources: deedResourcesData,
  };
};

/**
 * Tüm kategorileri getirir.
 */
export const getCategories = async () => {
  return await db.select().from(deedCategories).orderBy(asc(deedCategories.id));
};

/**
 * Tüm durumları (Farz, Sünnet vb.) getirir.
 */
export const getStatuses = async () => {
  return await db.select().from(deedStatuses);
};

// ==========================================
// 2. KAYNAK (RESOURCE) FONKSİYONLARI
// ==========================================

/**
 * Bir amele bağlı olan kaynakları (Ayet, Hadis) getirir.
 * Many-to-Many ilişkisini çözer.
 */
export const getDeedResources = async (deedId: number) => {
  return await db
    .select({
      id: resources.id,
      type: resources.type,
      content: resources.content,
      sourceInfo: resources.sourceInfo,
    })
    .from(resources)
    .innerJoin(deedResources, eq(resources.id, deedResources.resourceId))
    .where(eq(deedResources.deedId, deedId));
};

// ==========================================
// 3. KULLANICI VERİSİ FONKSİYONLARI (USER)
// ==========================================

/**
 * Belirli bir tarihte kullanıcının listesinde AKTİF olan amelleri getirir.
 *
 * Mantık:
 * 1. Amel, seçilen tarihten ÖNCE veya O GÜN eklenmiş olmalı (addedAt <= date).
 * 2. Amel, seçilen tarihten SONRA silinmiş olmalı VEYA hiç silinmemiş olmalı (removedAt > date OR removedAt is NULL).
 *
 * Not: Bu fonksiyon "Pazartesi/Cuma" filtresini yapmaz. Tüm aktif abonelikleri döner.
 * Gün filtrelemesini (filterDeedsForDate) bu veriyi aldıktan sonra JS tarafında yapmalısın.
 */
export const getUserDeeds = async (date: string) => {
  return await db
    .select({
      userDeedId: userDeeds.id,
      targetCount: userDeeds.targetCount,
      addedAt: userDeeds.addedAt,
      deedId: deeds.id,
      title: deeds.title,
      description: deeds.description,
      // ... (diğer amel detayları aynen kalır)
      virtueText: deeds.virtueText,
      startRef: deeds.startRef,
      endRef: deeds.endRef,
      intentionPoints: deeds.intentionPoints,
      deedPoints: deeds.deedPoints,
      periodCode: deedPeriods.code,
      categoryName: deedCategories.name,
      categoryIcon: deedCategories.iconUrl,
      statusName: deedStatuses.name,
      statusColor: deedStatuses.colorCode,

      // --- EKLENMESİ GEREKEN KISIM (LOGLAR) ---
      // Buradaki veriler null gelebilir (eğer o gün henüz işlem yapılmadıysa)
      logId: dailyLogs.id,
      isIntended: dailyLogs.isIntended, // Niyet edildi mi?
      isCompleted: dailyLogs.isCompleted, // Yapıldı mı?
      earnedPoints: dailyLogs.earnedPoints, // Kazanılan puan
    })
    .from(userDeeds)
    .innerJoin(deeds, eq(userDeeds.deedId, deeds.id))
    .leftJoin(deedPeriods, eq(deeds.periodId, deedPeriods.id))
    .leftJoin(deedCategories, eq(deeds.categoryId, deedCategories.id))
    .leftJoin(deedStatuses, eq(deeds.statusId, deedStatuses.id))

    // --- BURASI KRİTİK NOKTA ---
    // dailyLogs tablosunu bağlıyoruz.
    // Şartımız: Hem deedId tutacak HEM DE tarih o gün olacak.
    .leftJoin(
      dailyLogs,
      and(
        eq(dailyLogs.deedId, deeds.id),
        eq(dailyLogs.date, date), // Fonksiyona gelen 'date' parametresi burada kullanılıyor
      ),
    )
    .where(
      and(
        // O tarihte listeye eklenmiş miydi?
        lte(userDeeds.addedAt, date),
        // O tarihte henüz silinmemiş miydi?
        or(
          // A) Amel o tarihte henüz silinmemiş (Aktif)
          or(isNull(userDeeds.removedAt), gt(userDeeds.removedAt, date)),

          // B) VEYA: Amel silinmiş olsa bile, o gün 'yapılmış' veya 'niyet edilmiş' (Log kaydı var)
          isNotNull(dailyLogs.id),
        ),
      ),
    );
};

export const getDailyLogs = async (date: string, deedIds: number[]) => {
  if (deedIds.length === 0) return [];

  return await db
    .select()
    .from(dailyLogs)
    .where(and(eq(dailyLogs.date, date), inArray(dailyLogs.deedId, deedIds)));
};

export const getDeedHistory = async (deedId: number) => {
  return await db
    .select()
    .from(dailyLogs)
    .where(eq(dailyLogs.deedId, deedId))
    .orderBy(desc(dailyLogs.date)); // En yeniden eskiye
};

/**
 * Kullanıcı Profilini Getirir
 */
export const getUserProfile = async () => {
  // ID'si 1 olan tek kullanıcı varsayımıyla (Local First App)
  return await db.select().from(userProfile).where(eq(userProfile.id, 1)).get();
};

export const getDeedStatus = async (deedId: number) => {
  const userRecord = await db
    .select({ id: userDeeds.id }) // Sadece var mı yok mu baksak yeter
    .from(userDeeds)
    .where(
      and(
        eq(userDeeds.deedId, deedId),
        isNull(userDeeds.removedAt), // Aktif mi?
      ),
    )
    .get();

  return !!userRecord; // Boolean döner (true/false)
};

export const getPeriods = async () => {
  return await db.select().from(deedPeriods);
};
