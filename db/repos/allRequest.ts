import { db } from "@/db/client";
import {
  dailyLogs,
  deedCategories,
  deedPeriods,
  deedResources,
  deeds,
  deedStatuses,
  resources,
  userDeeds,
} from "@/db/schema";
import { getDateAttributes, isValidForPeriod } from "@/helpers/dateUtils";
import {
  and,
  asc,
  between,
  desc,
  eq,
  getTableColumns,
  gt,
  inArray,
  isNotNull,
  isNull,
  like,
  lte,
  min,
  or,
  sql,
  sum,
} from "drizzle-orm";

type DeedFilters = {
  search?: string;
  status?: string | null;
  category?: string;
  period?: string;
};

export const getDeeds = async (filters: DeedFilters = {}) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const limitDate = sevenDaysAgo.toISOString();

  let query = db
    .select({
      ...getTableColumns(deeds),
      category: deedCategories,
      status: deedStatuses,
      period: deedPeriods,
      isNew: sql<number>`CASE WHEN ${deeds.createdAt} >= ${limitDate} THEN 1 ELSE 0 END`,
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
    .orderBy(desc(deeds.createdAt))
    .$dynamic();

  const conditions = [];

  if (filters.search && filters.search.trim() !== "") {
    conditions.push(like(deeds.title, `%${filters.search}%`));
  }
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
      periodTitle: deedPeriods.title,

      // ✅ Kullanıcıya özel bilgiler (user_deeds tablosundan)
      level: userDeeds.level,
      addedAt: userDeeds.addedAt,
      // Amel listede mi? (user_deeds kaydı varsa ve silinmemişse true döner)
      isAdded: sql<boolean>`CASE WHEN ${userDeeds.id} IS NOT NULL AND ${userDeeds.removedAt} IS NULL THEN 1 ELSE 0 END`,
    })
    .from(deeds)
    .leftJoin(deedStatuses, eq(deeds.statusId, deedStatuses.id))
    .leftJoin(deedCategories, eq(deeds.categoryId, deedCategories.id))
    .leftJoin(deedPeriods, eq(deeds.periodId, deedPeriods.id))
    // ✅ user_deeds bağlantısı
    .leftJoin(userDeeds, eq(deeds.id, userDeeds.deedId))
    .where(eq(deeds.id, deedId))
    .get();

  if (!deedInfo) return null;

  // Kaynakları (Ayet/Hadis) çekme mantığı aynı kalıyor
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
    // SQLite'dan dönen 1/0 değerini kesin boolean'a çevirmek için:
    isAdded: Boolean(deedInfo.isAdded),
  };
};

export const getCategories = async () => {
  return await db.select().from(deedCategories).orderBy(asc(deedCategories.id));
};

export const getStatuses = async () => {
  return await db.select().from(deedStatuses);
};

export const getPeriods = async () => {
  return await db.select().from(deedPeriods);
};

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
// 2. KULLANICI VE TAKVİM İŞLEMLERİ (OPTIMIZED)
// ==========================================

export const getUserDeeds = async (date: string) => {
  const { tags } = getDateAttributes(date);

  return await db
    .select({
      userDeedId: userDeeds.id,
      level: userDeeds.level,
      targetCount: userDeeds.targetCount,
      addedAt: userDeeds.addedAt,
      removedAt: userDeeds.removedAt,

      deedId: deeds.id,
      title: deeds.title,
      description: deeds.description,
      virtueText: deeds.virtueText,
      startRef: deeds.startRef,
      endRef: deeds.endRef,
      intentionPoints: deeds.intentionPoints,
      deedPoints: deeds.deedPoints,

      periodCode: deedPeriods.code,
      categoryName: deedCategories.name,
      statusName: deedStatuses.name,
      statusColor: deedStatuses.colorCode,

      logId: dailyLogs.id,
      isIntended: dailyLogs.isIntended,
      isCompleted: dailyLogs.isCompleted,
      earnedPoints: dailyLogs.earnedPoints,
    })
    .from(userDeeds)
    .innerJoin(deeds, eq(userDeeds.deedId, deeds.id))
    .leftJoin(deedPeriods, eq(deeds.periodId, deedPeriods.id))
    .leftJoin(deedCategories, eq(deeds.categoryId, deedCategories.id))
    .leftJoin(deedStatuses, eq(deeds.statusId, deedStatuses.id))
    // O gün için bir kayıt var mı diye bakıyoruz
    .leftJoin(
      dailyLogs,
      and(eq(dailyLogs.deedId, deeds.id), eq(dailyLogs.date, date)),
    )
    .where(
      and(
        // 1. Günün anlamına uygun periyotları getir (Örn: Cuma ise hem DAILY hem WEEKLY_FRI)
        inArray(deedPeriods.code, tags),

        // 2. Amel, sorgulanan tarihten önce veya o tarihte eklenmiş olmalı
        lte(userDeeds.addedAt, date),

        or(
          isNull(userDeeds.removedAt), // Halen listede
          gt(userDeeds.removedAt, date), // O tarihte listedeydi ama sonra silindi
          isNotNull(dailyLogs.id), // Silinmiş olsa bile o gün tamamlanmışsa göster
        ),
      ),
    )
    .orderBy(deeds.id);
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
    .orderBy(desc(dailyLogs.date));
};

export const getDeedStatus = async (deedId: number) => {
  const userRecord = await db
    .select({ id: userDeeds.id })
    .from(userDeeds)
    .where(and(eq(userDeeds.deedId, deedId), isNull(userDeeds.removedAt)))
    .get();
  return !!userRecord;
};

export const calculateTotalPoints = async () => {
  const result = await db
    .select({ total: sum(dailyLogs.earnedPoints) })
    .from(dailyLogs);
  return Number(result[0]?.total) || 0;
};

export const getDeedStreak = async (deedId: number) => {
  const deedInfo = await db
    .select({ periodCode: deedPeriods.code })
    .from(deeds)
    .leftJoin(deedPeriods, eq(deeds.periodId, deedPeriods.id))
    .where(eq(deeds.id, deedId))
    .get();

  const targetCode = deedInfo?.periodCode || "DAILY";

  const logs = await db
    .select({ date: dailyLogs.date })
    .from(dailyLogs)
    .where(and(eq(dailyLogs.deedId, deedId), eq(dailyLogs.isCompleted, 1)))
    .orderBy(desc(dailyLogs.date));

  const completedDates = new Set(logs.map((l) => l.date));

  let streak = 0;
  let checkDate = new Date();
  let validDaysFound = 0;
  let safetyLimit = 730;

  while (validDaysFound < 21 && safetyLimit > 0) {
    safetyLimit--;
    const dateStr = checkDate.toISOString().split("T")[0];

    if (isValidForPeriod(checkDate, targetCode)) {
      if (completedDates.has(dateStr)) {
        streak++;
      } else {
        if (validDaysFound !== 0) break;
      }
      validDaysFound++;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return streak;
};

export const getEarliestActivityDate = async () => {
  const firstLog = await db
    .select({ date: min(dailyLogs.date) })
    .from(dailyLogs)
    .get();
  const firstDeed = await db
    .select({ date: min(userDeeds.addedAt) })
    .from(userDeeds)
    .get();
  return firstLog?.date || firstDeed?.date || null;
};

export const calculateDeedTotalPoints = async (deedId: number) => {
  const result = await db
    .select({ total: sum(dailyLogs.earnedPoints) })
    .from(dailyLogs)
    .where(eq(dailyLogs.deedId, deedId))
    .get(); // Tek bir sonuç döneceği için .get() kullanıyoruz

  // SQLite sum sonucu string dönebilir veya hiç kayıt yoksa null döner,
  // bu yüzden Number() ile sarmalayıp 0 kontrolü yapıyoruz.
  return Number(result?.total) || 0;
};

// db/queries.ts
export const getDeedCompletedDates = async (deedId: number) => {
  const year = new Date().getFullYear();
  const startStr = `${year}-01-01`;
  const endStr = `${year}-12-31`;

  const logs = await db
    .select({ date: dailyLogs.date })
    .from(dailyLogs)
    .where(
      and(
        eq(dailyLogs.deedId, deedId),
        eq(dailyLogs.isCompleted, 1),
        between(dailyLogs.date, startStr, endStr),
      ),
    );

  return new Set(logs.map((l) => l.date));
};

export const getLibraryDashboardData = async (
  startDate: string,
  endDate: string,
) => {
  // Performans: Tüm sorguları tek bir Promise.all içinde paralel başlatıyoruz.
  // Bu, SQLite bekleme sürelerini (IO) minimize eder.
  const [chartResults, categoryStats, summary] = await Promise.all([
    // 1. Sorgu: Grafik için günlük toplamlar (Sadece gerekli sütunlar)
    db
      .select({
        date: dailyLogs.date,
        total: sql<number>`CAST(SUM(${dailyLogs.earnedPoints}) AS INTEGER)`,
      })
      .from(dailyLogs)
      .where(between(dailyLogs.date, startDate, endDate))
      .groupBy(dailyLogs.date)
      .orderBy(asc(dailyLogs.date)),

    // 2. Sorgu: En iyi 5 kategori
    db
      .select({ name: deedCategories.name })
      .from(dailyLogs)
      .innerJoin(deeds, eq(dailyLogs.deedId, deeds.id))
      .innerJoin(deedCategories, eq(deeds.categoryId, deedCategories.id))
      .groupBy(deedCategories.name)
      .orderBy(desc(sql`SUM(${dailyLogs.earnedPoints})`))
      .limit(5),

    // 3. Sorgu: Genel özet (Tüm zamanlar veya seçili aralık)
    db
      .select({
        totalPoints: sql<number>`CAST(SUM(${dailyLogs.earnedPoints}) AS INTEGER)`,
        totalLogs: sql<number>`COUNT(${dailyLogs.id})`,
      })
      .from(dailyLogs)
      .where(eq(dailyLogs.isCompleted, 1))
      .get(),
  ]);

  // NaN HATASI İÇİN PERFORMANSLI NORMALİZASYON
  // JS'de döngü sayısını azaltmak için direkt sonuç üzerinden map yapıyoruz.
  const chartData = chartResults.map((r, i) => ({
    x: i,
    y: r.total || 0,
    label: r.date?.split("-").reverse().slice(0, 2).join("/") || "", // "20-05" formatı (JS Date nesnesinden daha hızlıdır)
  }));

  // Grafik kütüphanesinin (length - 1) formülü için güvenlik:
  // Eğer 0 veya 1 veri varsa, sahte veri eklemek yerine boş bir dizi yerine
  // stabil bir fallback dönüyoruz.
  const safeChartData =
    chartData.length > 1
      ? chartData
      : chartData.length === 1
        ? [
            { x: 0, y: 0, label: "" },
            { x: 1, y: chartData[0].y, label: chartData[0].label },
          ]
        : [
            { x: 0, y: 0, label: "" },
            { x: 1, y: 0, label: "" },
          ];

  return {
    chartData: safeChartData,
    topCategories: categoryStats.map((c) => c.name),
    stats: {
      totalPoints: summary?.totalPoints || 0,
      completedCount: summary?.totalLogs || 0,
    },
  };
};
