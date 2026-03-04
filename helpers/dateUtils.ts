import { toHijri } from "hijri-converter";
import { hijriStringToGregorianDate } from "./hijriUtils";

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
 * Bir Hicri tarihin üzerindeki tüm etiketleri (Tags) hesaplar.
 * @param hijriDateStr "1446-08-22" formatında Hicri tarih
 * @returns Tags array ve hijri bilgileri
 */
export const getDateAttributes = (hijriDateStr: string) => {
  // Hicri tarihi parse et
  const [hy, hm, hd] = hijriDateStr.split("-").map(Number);

  // Her gün DAILY grubundadır
  const tags: string[] = [PERIOD_CODES.DAILY];

  // 1. HAFTALIK KONTROLLER (Miladi gün bazlı - Cuma namazı için)
  // Hicri → Miladi çevir
  const gregorianDate = hijriStringToGregorianDate(hijriDateStr);
  const dayOfWeek = gregorianDate.getDay(); // 0:Pazar ... 5:Cuma

  if (dayOfWeek === 5) tags.push(PERIOD_CODES.WEEKLY_FRI);
  if (dayOfWeek === 1 || dayOfWeek === 4) tags.push(PERIOD_CODES.WEEKLY_MON_THU);

  // 2. HİCRİ ÖZEL GÜN KONTROLLERİ

  // Ramazan Ayı
  if (hm === 9) {
    tags.push(PERIOD_CODES.YEARLY_RAMADAN);
    if (hd === 27) tags.push(PERIOD_CODES.SPECIAL_QADR);
  }

  // Kandiller
  if (hm === 7 && hd === 27) tags.push(PERIOD_CODES.SPECIAL_MIRAC);
  if (hm === 8 && hd === 15) tags.push(PERIOD_CODES.SPECIAL_BERAT);
  if (hm === 3 && hd === 12) tags.push(PERIOD_CODES.SPECIAL_MEVLID);

  // Arefe (Kurban Arefesi - Zilhicce 9)
  if (hm === 12 && hd === 9) tags.push(PERIOD_CODES.SPECIAL_AREFE);

  // Bayramlar
  if (hm === 10 && hd <= 3) tags.push(PERIOD_CODES.EID_RAMADAN);
  if (hm === 12 && hd >= 10 && hd <= 13) tags.push(PERIOD_CODES.EID_ADHA);

  // Mevsimsel
  if ([7, 8, 9].includes(hm)) tags.push(PERIOD_CODES.SEASON_THREE_MONTHS);
  if (hm === 12 && hd <= 10) tags.push(PERIOD_CODES.SEASON_ZULHIJJAH_10);
  if (hm === 1 && hd === 10) tags.push(PERIOD_CODES.SPECIAL_ASHURA);

  return {
    hijriDate: hijriDateStr,
    hijri: { year: hy, month: hm, day: hd },
    gregorianDate,
    tags,
  };
};

/**
 * Kritik Fonksiyon: Verilen Hicri tarih, bu amel kodu için geçerli mi?
 * @param hijriDateStr "1446-08-22"
 * @param periodCode "WEEKLY_FRI", "YEARLY_RAMADAN" vb.
 */
export const isValidForPeriod = (hijriDateStr: string, periodCode: string) => {
  if (!periodCode || periodCode === PERIOD_CODES.DAILY) return true;

  const { tags } = getDateAttributes(hijriDateStr);
  return tags.includes(periodCode);
};
