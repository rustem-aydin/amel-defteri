import { toHijri } from "hijri-converter";

// Veritabanındaki "kod"lar ile eşleşecek etiketler
export const getDateTags = (date: Date): string[] => {
  const tags = ["DAILY"]; // Günlük her zaman var

  // 1. HAFTALIK KONTROLLER (Miladi Takvimden)
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 5) tags.push("WEEKLY_FRI"); // Cuma
  if (dayOfWeek === 1 || dayOfWeek === 4) tags.push("WEEKLY_MON_THU"); // Pzt/Per (Oruç)

  // 2. HİCRİ KONTROLLER (Hicri Takvime Çevir)
  const hijri = toHijri(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  // hijri.hy (Yıl), hijri.hm (Ay), hijri.hd (Gün)

  // --- ÜÇ AYLAR ---
  if (hijri.hm === 7 || hijri.hm === 8 || hijri.hm === 9) {
    tags.push("SEASON_THREE_MONTHS");
  }

  if (hijri.hm === 9) {
    tags.push("YEARLY_RAMADAN");

    if (hijri.hd === 27) tags.push("SPECIAL_QADR");
  }

  if (hijri.hm === 7 && hijri.hd === 27) tags.push("SPECIAL_MIRAC");
  // Berat (Şaban 15)
  if (hijri.hm === 8 && hijri.hd === 15) tags.push("SPECIAL_BERAT");

  // --- BAYRAMLAR ---
  // Ramazan Bayramı (Şevval 1-3)
  if (hijri.hm === 10 && hijri.hd <= 3) tags.push("EID_RAMADAN");

  // Zilhicce (İlk 10 gün çok faziletli)
  if (hijri.hm === 12 && hijri.hd <= 10) tags.push("SEASON_ZULHIJJAH_10");

  // Aşure Günü (Muharrem 10)
  if (hijri.hm === 1 && hijri.hd === 10) tags.push("SPECIAL_ASHURA");

  return tags;
};
