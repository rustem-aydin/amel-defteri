import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

// Mevcut veritabanı isminle aynı olmalı
export const expoDb = openDatabaseSync("benamel.db");

// Drizzle'ı başlatıyoruz ve şemayı içine yüklüyoruz
export const db = drizzle(expoDb, { logger: true });

export const flushDatabase = () => {
  try {
    expoDb.execSync("PRAGMA wal_checkpoint(TRUNCATE)");
  } catch (e) {
    console.log("Flush error (ignore):", e);
  }
};

/**
 * 🧨 HARD RESET: Tüm veritabanını siler.
 * Geliştirme aşamasında şema değişiklikleri için kullanılır.
 */
export const resetDatabase = () => {
  console.log("🧨 VERİTABANI SIFIRLANIYOR...");
  try {
    expoDb.execSync("PRAGMA foreign_keys = OFF;");

    // Tüm tabloları bul
    const tables = expoDb.getAllSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_migrations';"
    );

    // Hepsini sil
    for (const table of tables) {
      expoDb.execSync(`DROP TABLE IF EXISTS "${table.name}";`);
      console.log(`🗑️ Tablo silindi: ${table.name}`);
    }

    // Migration geçmişini de sil (Drizzle tekrar çalışsın diye)
    expoDb.execSync("DROP TABLE IF EXISTS __drizzle_migrations;");

    expoDb.execSync("PRAGMA foreign_keys = ON;");
    console.log("✅ Veritabanı tertemiz oldu.");
  } catch (error) {
    console.error("❌ Reset hatası:", error);
  }
};
