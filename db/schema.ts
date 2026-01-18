// db/schema.ts
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// 1. LIBRARY TABLES (Static Data)

// "amel_donemleri" -> "deed_periods"
export const deedPeriods = sqliteTable("deed_periods", {
  id: integer("id").primaryKey(),
  code: text("code"),
  title: text("title"),
});

export const deedStatuses = sqliteTable("deed_statuses", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(), // ad
  colorCode: text("color_code"), // renk_kodu
});

// "amel_kategorileri" -> "deed_categories"
export const deedCategories = sqliteTable("deed_categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(), // ad
  iconUrl: text("icon_url"), // ikon_url
});

// "ameller_data" -> "deeds"
export const deeds = sqliteTable("deeds", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(), // baslik
  description: text("description"), // aciklama
  virtueText: text("virtue_text"), // fazilet_metni
  startRef: text("start_ref"), // start_ref (Teknik terim, kalabilir)
  endRef: text("end_ref"), // end_ref
  timeMask: text("time_mask"), // kerahat_mask (Validity/Time restriction)
  intentionPoints: integer("intention_points").default(0), // puan_niyet
  deedPoints: integer("deed_points").default(0), // puan_amel

  // Foreign Keys
  categoryId: integer("category_id").references(() => deedCategories.id),
  statusId: integer("status_id").references(() => deedStatuses.id),
  periodId: integer("period_id").references(() => deedPeriods.id),
});

// "kaynaklar" -> "resources"
export const resources = sqliteTable("resources", {
  id: integer("id").primaryKey(),
  type: text("type"), // tur
  content: text("content"), // metin
  sourceInfo: text("source_info"), // kaynak_bilgisi
});

// "amel_kaynak_baglanti" -> "deed_resources" (Many-to-Many)
export const deedResources = sqliteTable(
  "deed_resources",
  {
    deedId: integer("deed_id")
      .notNull()
      .references(() => deeds.id),
    resourceId: integer("resource_id")
      .notNull()
      .references(() => resources.id),
  },
  (t) => ({
    pk: uniqueIndex("pk_deed_resource").on(t.deedId, t.resourceId),
  }),
);
export const userDeeds = sqliteTable(
  "user_deeds",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deedId: integer("deed_id")
      .notNull()
      .references(() => deeds.id), // İlişki
    addedAt: text("added_at").notNull(),
    removedAt: text("removed_at"),
    targetCount: integer("target_count").default(1),
  },
  (t) => ({
    idxDeedId: uniqueIndex("idx_user_deeds_unique_deed_id").on(t.deedId),
  }),
);
export const dailyLogs = sqliteTable(
  "daily_logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deedId: integer("deed_id").references(() => deeds.id),
    date: text("date"), // tarih
    isIntended: integer("is_intended").default(0), // niyet_edildi
    isCompleted: integer("is_completed").default(0), // tamamlandi
    earnedPoints: integer("earned_points").default(0), // kazanilan_puan
  },
  (t) => ({
    // Aynı gün aynı amel tekrar eklenemez
    idxDeedDate: uniqueIndex("idx_daily_logs_deed_date").on(t.deedId, t.date),
  }),
);

export const userProfile = sqliteTable("user_profile", {
  id: integer("id").primaryKey().default(1),
  totalPoints: integer("total_points").default(0), // toplam_puan
  level: integer("level").default(1), // seviye
});
