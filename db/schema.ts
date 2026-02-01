// db/schema.ts

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const deedPeriods = sqliteTable("deed_periods", {
  id: integer("id").primaryKey(),
  code: text("code"),
  title: text("title"),
});

export const deedStatuses = sqliteTable("deed_statuses", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  colorCode: text("color_code"),
});

export const deedCategories = sqliteTable("deed_categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const deeds = sqliteTable(
  "deeds",
  {
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    virtueText: text("virtue_text"),
    startRef: text("start_ref"),
    endRef: text("end_ref"),
    timeMask: text("time_mask"),
    intentionPoints: integer("intention_points").default(0),
    deedPoints: integer("deed_points").default(0),

    createdAt: text("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),

    updatedAt: text("updated_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),

    categoryId: integer("category_id").references(() => deedCategories.id),
    statusId: integer("status_id").references(() => deedStatuses.id),
    periodId: integer("period_id").references(() => deedPeriods.id),
  },
  (t) => ({
    idxCategoryId: index("idx_deeds_category_id").on(t.categoryId),
    idxStatusId: index("idx_deeds_status_id").on(t.statusId),
    idxPeriodId: index("idx_deeds_period_id").on(t.periodId),

    idxUpdatedAt: index("idx_deeds_updated_at").on(t.updatedAt),
  }),
);

export const resources = sqliteTable("resources", {
  id: integer("id").primaryKey(),
  type: text("type"),
  content: text("content"),
  sourceInfo: text("source_info"),
});

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
    // ✅ Kaynaktan amele gitmek gerekirse diye (Opsiyonel ama iyi)
    idxResourceId: index("idx_deed_resources_resource_id").on(t.resourceId),
  }),
);

export const userDeeds = sqliteTable(
  "user_deeds",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deedId: integer("deed_id")
      .notNull()
      .references(() => deeds.id),
    addedAt: text("added_at").notNull(), // Listeye eklenme tarihi
    removedAt: text("removed_at"), // Listeden çıkma tarihi
    level: integer("level").default(1),
    lastMilestone: integer("last_milestone").default(0),

    targetCount: integer("target_count").default(1),
  },
  (t) => ({
    idxDeedId: uniqueIndex("idx_user_deeds_unique_deed_id").on(t.deedId),

    idxAddedAt: index("idx_user_deeds_added_at").on(t.addedAt),
    idxRemovedAt: index("idx_user_deeds_removed_at").on(t.removedAt),
  }),
);

export const dailyLogs = sqliteTable(
  "daily_logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    deedId: integer("deed_id").references(() => deeds.id),
    date: text("date"), // YYYY-MM-DD formatında tutuyoruz
    isIntended: integer("is_intended").default(0),
    isCompleted: integer("is_completed").default(0),
    earnedPoints: integer("earned_points").default(0),
  },
  (t) => ({
    idxDeedDate: uniqueIndex("idx_daily_logs_deed_date").on(t.deedId, t.date),

    idxDate: index("idx_daily_logs_date").on(t.date),
  }),
);
