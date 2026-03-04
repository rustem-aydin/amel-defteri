// services/syncService.ts

import { db } from "@/db/client";
import { desc, sql } from "drizzle-orm"; // ✅ 'desc' ekledik
import {
  deedCategories,
  deedPeriods,
  deedResources,
  deeds,
  deedStatuses,
  resources,
} from "../db/schema";
import { supabase } from "./supabase";

let isSyncing = false;

export const checkForUpdates = async (): Promise<boolean> => {
  try {
    // 1. SQLite'daki en son güncellenmiş kaydı bul (En sağlam yöntem)
    const localResult = await db
      .select({ updatedAt: deeds.updatedAt })
      .from(deeds)
      .orderBy(desc(deeds.updatedAt))
      .limit(1)
      .get();

    // Değer null ise çok eski bir tarih kullanıyoruz
    const lastLocalUpdate = localResult?.updatedAt || "2000-01-01T00:00:00Z";

    console.log("🔍 SQLite'daki Son Tarih:", lastLocalUpdate);

    // 2. Supabase Sorgusu (head: true ile sıfır data transferi)
    const { count, error } = await supabase
      .from("ameller")
      .select("id", { count: "exact", head: true })
      .gt("updated_at", lastLocalUpdate);

    if (error) {
      console.error("❌ Supabase Hatası:", error.message);
      return false;
    }

    const hasNewData = (count || 0) > 0;
    if (hasNewData) console.log(`🚀 Sunucuda ${count} yeni/güncel kayıt var!`);

    return hasNewData;
  } catch (error) {
    console.error("🚨 Güncelleme kontrolünde hata:", error);
    return false;
  }
};

export const syncAllData = async () => {
  if (isSyncing) return { status: "LOCKED" };
  isSyncing = true;

  try {
    // Supabase'den tüm tabloları çek
    const [
      { data: donemler },
      { data: durumlar },
      { data: kategoriler },
      { data: ameller },
      { data: kaynakList },
      { data: baglantilar },
    ] = await Promise.all([
      supabase.from("amel_donemleri").select("*"),
      supabase.from("amel_durumu").select("*"),
      supabase.from("amel_kategorileri").select("*"),
      supabase.from("ameller").select("*"),
      supabase.from("kaynaklar").select("*"),
      supabase.from("amel_kaynak_baglanti").select("*"),
    ]);

    await db.transaction(async (tx) => {
      // 1. Durumlar (Statuses)
      if (durumlar?.length) {
        await tx
          .insert(deedStatuses)
          .values(
            durumlar.map((d) => ({
              id: d.id,
              name: d.ad,
              colorCode: d.renk_kodu,
            })),
          )
          .onConflictDoUpdate({
            target: deedStatuses.id,
            set: {
              name: sql`excluded.name`,
              colorCode: sql`excluded.color_code`,
            },
          });
      }

      // 2. Dönemler (Periods)
      if (donemler?.length) {
        await tx
          .insert(deedPeriods)
          .values(
            donemler.map((d) => ({ id: d.id, code: d.kod, title: d.baslik })),
          )
          .onConflictDoUpdate({
            target: deedPeriods.id,
            set: { code: sql`excluded.code`, title: sql`excluded.title` },
          });
      }

      // 3. Kategoriler (Categories)
      if (kategoriler?.length) {
        await tx
          .insert(deedCategories)
          .values(kategoriler.map((k) => ({ id: k.id, name: k.ad })))
          .onConflictDoUpdate({
            target: deedCategories.id,
            set: { name: sql`excluded.name` },
          });
      }

      // 4. Ameller (Deeds) - En Önemlisi
      if (ameller?.length) {
        const deedValues = ameller.map((a) => ({
          id: a.id,
          title: a.baslik,
          description: a.aciklama,
          virtueText: a.fazilet_metni,
          startRef: a.start_ref,
          endRef: a.end_ref,
          timeMask: a.kerahat_mask,
          // intentionPoints kaldırıldı
          deedPoints: a.puan_amel,
          categoryId: a.amel_kategori_id,
          statusId: a.amel_durumu_id,
          periodId: a.donem_id,
          createdAt: a.created_at || new Date().toISOString(),
          updatedAt: a.updated_at || a.created_at || new Date().toISOString(), // ✅ Veriyi al
        }));

        await tx
          .insert(deeds)
          .values(deedValues)
          .onConflictDoUpdate({
            target: deeds.id,
            set: {
              title: sql`excluded.title`,
              description: sql`excluded.description`,
              virtueText: sql`excluded.virtue_text`,
              deedPoints: sql`excluded.deed_points`,
              updatedAt: sql`excluded.updated_at`, // ✅ Güncelleme tarihini SQLite'a yaz
              categoryId: sql`excluded.category_id`,
              statusId: sql`excluded.status_id`,
              periodId: sql`excluded.period_id`,
            },
          });
      }

      // 5. Kaynaklar (Resources)
      if (kaynakList?.length) {
        await tx
          .insert(resources)
          .values(
            kaynakList.map((k) => ({
              id: k.id,
              type: k.tur,
              content: k.metin,
              sourceInfo: k.kaynak_bilgisi,
            })),
          )
          .onConflictDoUpdate({
            target: resources.id,
            set: {
              type: sql`excluded.type`,
              content: sql`excluded.content`,
              sourceInfo: sql`excluded.source_info`,
            },
          });
      }

      // 6. Bağlantılar (Deed-Resource Junction)
      if (baglantilar?.length) {
        await tx
          .insert(deedResources)
          .values(
            baglantilar.map((b) => ({
              deedId: b.amel_id,
              resourceId: b.kaynak_id,
            })),
          )
          .onConflictDoNothing();
      }
    });
    await db.select({ id: deeds.id }).from(deeds).limit(1).get();

    return { status: "SUCCESS" };
  } catch (error: any) {
    console.error("❌ Sync Error:", error.message);
    return { status: "ERROR", message: error.message };
  } finally {
    isSyncing = false;
  }
};
