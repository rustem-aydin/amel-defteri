import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

// Mevcut veritabanı isminle aynı olmalı
const expoDb = openDatabaseSync("benamel.db");

// Drizzle'ı başlatıyoruz ve şemayı içine yüklüyoruz
export const db = drizzle(expoDb, { logger: true });
