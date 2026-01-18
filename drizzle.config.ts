import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts", // Birazdan oluşturacağız
  out: "./drizzle", // Migrasyon dosyalarının çıkacağı yer
  dialect: "sqlite",
  driver: "expo",
  dbCredentials: {
    url: "sqlite.db", // Veritabanı dosya adın (veya process.env.DB_URL)
  },
});
