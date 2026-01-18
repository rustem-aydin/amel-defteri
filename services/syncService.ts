import { sql } from "drizzle-orm";
import { db } from "../db/client";
import {
  deedCategories,
  deedPeriods,
  deedResources,
  deeds,
  deedStatuses,
  resources,
} from "../db/schema"; // Yeni İngilizce tablo isimleri
import { supabase } from "./supabase";

let isSyncing = false;

export const syncAllData = async () => {
  if (isSyncing) return { status: "LOCKED" };
  isSyncing = true;

  try {
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
      // --- A. Statuses (Amel Durumları) ---
      if (durumlar && durumlar.length > 0) {
        // Mapping: Supabase(TR) -> Local(EN)
        const values = durumlar.map((d) => ({
          id: d.id,
          name: d.ad, // ad -> name
          colorCode: d.renk_kodu, // renk_kodu -> colorCode
        }));

        await tx
          .insert(deedStatuses)
          .values(values)
          .onConflictDoUpdate({
            target: deedStatuses.id,
            set: {
              name: sql`excluded.name`,
              colorCode: sql`excluded.color_code`, // SQL sütun adı snake_case
            },
          });
      }

      // --- B. Periods (Amel Dönemleri) ---
      if (donemler && donemler.length > 0) {
        const values = donemler.map((d) => ({
          id: d.id,
          code: d.kod, // kod -> code
          title: d.baslik, // baslik -> title
        }));

        await tx
          .insert(deedPeriods)
          .values(values)
          .onConflictDoUpdate({
            target: deedPeriods.id,
            set: {
              code: sql`excluded.code`,
              title: sql`excluded.title`,
            },
          });
      }

      // --- C. Categories (Kategoriler) ---
      if (kategoriler && kategoriler.length > 0) {
        const values = kategoriler.map((k) => ({
          id: k.id,
          name: k.ad, // ad -> name
          iconUrl: k.ikon_url, // ikon_url -> iconUrl
        }));

        await tx
          .insert(deedCategories)
          .values(values)
          .onConflictDoUpdate({
            target: deedCategories.id,
            set: {
              name: sql`excluded.name`,
              iconUrl: sql`excluded.icon_url`,
            },
          });
      }

      // --- D. Deeds (Ameller - Ana Tablo) ---
      if (ameller && ameller.length > 0) {
        const values = ameller.map((a) => ({
          id: a.id,
          title: a.baslik, // baslik -> title
          description: a.aciklama, // aciklama -> description
          virtueText: a.fazilet_metni, // fazilet_metni -> virtueText
          startRef: a.start_ref,
          endRef: a.end_ref,
          timeMask: a.kerahat_mask, // kerahat_mask -> timeMask
          intentionPoints: a.puan_niyet, // puan_niyet -> intentionPoints
          deedPoints: a.puan_amel, // puan_amel -> deedPoints

          // İlişkiler (Foreign Keys)
          categoryId: a.amel_kategori_id,
          statusId: a.amel_durumu_id,
          periodId: a.donem_id,
        }));

        await tx
          .insert(deeds)
          .values(values)
          .onConflictDoUpdate({
            target: deeds.id,
            set: {
              title: sql`excluded.title`,
              description: sql`excluded.description`,
              virtueText: sql`excluded.virtue_text`,
              startRef: sql`excluded.start_ref`,
              endRef: sql`excluded.end_ref`,
              timeMask: sql`excluded.time_mask`,
              intentionPoints: sql`excluded.intention_points`,
              deedPoints: sql`excluded.deed_points`,
              categoryId: sql`excluded.category_id`,
              statusId: sql`excluded.status_id`,
              periodId: sql`excluded.period_id`,
            },
          });
      }

      if (kaynakList && kaynakList.length > 0) {
        const values = kaynakList.map((k) => ({
          id: k.id,
          type: k.tur, // tur -> type
          content: k.metin, // metin -> content
          sourceInfo: k.kaynak_bilgisi, // kaynak_bilgisi -> sourceInfo
        }));

        await tx
          .insert(resources)
          .values(values)
          .onConflictDoUpdate({
            target: resources.id,
            set: {
              type: sql`excluded.type`,
              content: sql`excluded.content`,
              sourceInfo: sql`excluded.source_info`,
            },
          });
      }

      // --- F. Deed Resources (Amel-Kaynak Bağlantısı) ---
      if (baglantilar && baglantilar.length > 0) {
        const values = baglantilar.map((b) => ({
          deedId: b.amel_id, // amel_id -> deedId
          resourceId: b.kaynak_id, // kaynak_id -> resourceId
        }));

        await tx.insert(deedResources).values(values).onConflictDoNothing();
      }
    });

    return { status: "SUCCESS" };
  } catch (error: any) {
    return { status: "ERROR", message: error.message };
  } finally {
    isSyncing = false;
  }
};
