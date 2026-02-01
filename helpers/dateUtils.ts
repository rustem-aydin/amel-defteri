import { toHijri } from "hijri-converter";

// CSV ve Veritabanındaki 'code' sütunuyla BİREBİR aynı olmalı
export const PERIOD_CODES = {
  DAILY: "DAILY",
  WEEKLY_FRI: "WEEKLY_FRI",
  WEEKLY_MON_THU: "WEEKLY_MON_THU",
  YEARLY_RAMADAN: "YEARLY_RAMADAN",
  SPECIAL_QADR: "SPECIAL_QADR",
  SPECIAL_AREFE: "SPECIAL_AREFE",
  SPECIAL_MIRAC: "SPECIAL_MIRAC",
  SPECIAL_BERAT: "SPECIAL_BERAT",
  SPECIAL_MEVLID: "SPECIAL_MEVLID",
  SPECIAL_ASHURA: "SPECIAL_ASHURA",
  EID_RAMADAN: "EID_RAMADAN",
  EID_ADHA: "EID_ADHA",
  SEASON_THREE_MONTHS: "SEASON_THREE_MONTHS",
  SEASON_ZULHIJJAH_10: "SEASON_ZULHIJJAH_10",
};

export const HIJRI_MONTHS = [
  "Muharrem",
  "Safer",
  "Rebiülevvel",
  "Rebiülahir",
  "Cemaziyelevvel",
  "Cemaziyelahir",
  "Receb",
  "Şaban",
  "Ramazan",
  "Şevval",
  "Zilkade",
  "Zilhicce",
];

/**
 * Bir tarihin üzerindeki tüm etiketleri (Tags) hesaplar.
 * Örn: 25.01.2026 -> ['DAILY', 'WEEKLY_MON_THU', 'SPECIAL_BERAT']
 */
export const getDateAttributes = (dateInput: Date | string) => {
  const date = new Date(dateInput);
  // Her gün DAILY grubundadır (Namaz vb. için)
  const tags: string[] = [PERIOD_CODES.DAILY];

  // 1. HAFTALIK KONTROLLER (Miladi)
  const dayOfWeek = date.getDay(); // 0:Pazar ... 5:Cuma
  if (dayOfWeek === 5) tags.push(PERIOD_CODES.WEEKLY_FRI);
  if (dayOfWeek === 1 || dayOfWeek === 4)
    tags.push(PERIOD_CODES.WEEKLY_MON_THU);

  // 2. HİCRİ HESAPLAMA
  const hijri = toHijri(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  // --- ÖZEL GÜN KONTROLLERİ ---

  // Ramazan Ayı
  if (hijri.hm === 9) {
    tags.push(PERIOD_CODES.YEARLY_RAMADAN);
    if (hijri.hd === 27) tags.push(PERIOD_CODES.SPECIAL_QADR);
  }

  // Kandiller
  if (hijri.hm === 7 && hijri.hd === 27) tags.push(PERIOD_CODES.SPECIAL_MIRAC);
  if (hijri.hm === 8 && hijri.hd === 15) tags.push(PERIOD_CODES.SPECIAL_BERAT);
  if (hijri.hm === 3 && hijri.hd === 12) tags.push(PERIOD_CODES.SPECIAL_MEVLID);

  // Arefe (Kurban Arefesi - Zilhicce 9)
  if (hijri.hm === 12 && hijri.hd === 9) tags.push(PERIOD_CODES.SPECIAL_AREFE);

  // Bayramlar
  if (hijri.hm === 10 && hijri.hd <= 3) tags.push(PERIOD_CODES.EID_RAMADAN);
  if (hijri.hm === 12 && hijri.hd >= 10 && hijri.hd <= 13)
    tags.push(PERIOD_CODES.EID_ADHA);

  // Mevsimsel
  if ([7, 8, 9].includes(hijri.hm)) tags.push(PERIOD_CODES.SEASON_THREE_MONTHS);
  if (hijri.hm === 12 && hijri.hd <= 10)
    tags.push(PERIOD_CODES.SEASON_ZULHIJJAH_10);
  if (hijri.hm === 1 && hijri.hd === 10) tags.push(PERIOD_CODES.SPECIAL_ASHURA);

  return {
    date,
    hijri,
    tags,
  };
};

/**
 * Kritik Fonksiyon: Verilen tarih, bu amel kodu için geçerli mi?
 * Örn: Bugün 'Salı' ise ve kod 'WEEKLY_MON_THU' ise FALSE döner.
 */
export const isValidForPeriod = (date: Date, periodCode: string) => {
  if (!periodCode || periodCode === PERIOD_CODES.DAILY) return true;

  const { tags } = getDateAttributes(date);
  return tags.includes(periodCode);
};
