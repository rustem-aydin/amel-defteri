import { toGregorian, toHijri } from "hijri-converter";

/**
 * Hicri Ay İsimleri
 */
export const HIJRI_MONTHS = [
  "Muharrem", // 1
  "Safer", // 2
  "Rebiülevvel", // 3
  "Rebiülahir", // 4
  "Cemaziyelevvel", // 5
  "Cemaziyelahir", // 6
  "Receb", // 7
  "Şaban", // 8
  "Ramazan", // 9
  "Şevval", // 10
  "Zilkade", // 11
  "Zilhicce", // 12
];

/**
 * Hicri Ay Kısaltmaları (Grafik için)
 */
export const HIJRI_MONTHS_SHORT = [
  "Muh",
  "Saf",
  "Reb1",
  "Reb2",
  "Cem1",
  "Cem2",
  "Rec",
  "Şab",
  "Ram",
  "Şev",
  "Zlk",
  "Zlh",
];

/**
 * Miladi Ay İsimleri (Yedek gösterimler için)
 */
export const GREGORIAN_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

/**
 * Sayıyı 2 haneye tamamla
 */
const pad = (n: number): string => String(n).padStart(2, "0");

/**
 * Bugünün Hicri tarihini string olarak döndürür
 * @returns "1446-08-22" formatında
 */
export const getCurrentHijriDate = (): string => {
  const now = new Date();
  const hijri = toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return `${hijri.hy}-${pad(hijri.hm)}-${pad(hijri.hd)}`;
};

/**
 * Miladi Date objesini Hicri string'e çevirir
 * @param date Miladi Date objesi
 * @returns "1446-08-22" formatında
 */
export const gregorianToHijriString = (date: Date): string => {
  const hijri = toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${hijri.hy}-${pad(hijri.hm)}-${pad(hijri.hd)}`;
};

/**
 * Hicri string'i Miladi Date objesine çevirir
 * @param hijriStr "1446-08-22" formatında
 * @returns Miladi Date objesi
 */
export const hijriStringToGregorianDate = (hijriStr: string): Date => {
  const [hy, hm, hd] = hijriStr.split("-").map(Number);
  const greg = toGregorian(hy, hm, hd);
  return new Date(greg.gy, greg.gm - 1, greg.gd);
};

/**
 * Hicri string'i Miladi string'e çevirir
 * @param hijriStr "1446-08-22"
 * @returns "2025-02-15" formatında
 */
export const hijriToGregorianString = (hijriStr: string): string => {
  const [hy, hm, hd] = hijriStr.split("-").map(Number);
  const greg = toGregorian(hy, hm, hd);
  return `${greg.gy}-${pad(greg.gm)}-${pad(greg.gd)}`;
};

/**
 * Miladi string'i Hicri string'e çevirir
 * @param gregorianStr "2025-02-15"
 * @returns "1446-08-22" formatında
 */
export const gregorianStringToHijri = (gregorianStr: string): string => {
  const [gy, gm, gd] = gregorianStr.split("-").map(Number);
  const hijri = toHijri(gy, gm, gd);
  return `${hijri.hy}-${pad(hijri.hm)}-${pad(hijri.hd)}`;
};

/**
 * Hicri bir aya kaç gün olduğunu hesaplar
 * @param year Hicri yıl
 * @param month Hicri ay (1-12)
 * @returns Ay uzunluğu (29 veya 30)
 */
export const getHijriMonthLength = (year: number, month: number): number => {
  // Bu ayın 1'i
  const thisMonthStart = toGregorian(year, month, 1);

  // Bir sonraki ayın 1'i
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonthStart = toGregorian(nextYear, nextMonth, 1);

  // Miladi tarihler arası fark = ay uzunluğu
  const date1 = new Date(thisMonthStart.gy, thisMonthStart.gm - 1, thisMonthStart.gd);
  const date2 = new Date(nextMonthStart.gy, nextMonthStart.gm - 1, nextMonthStart.gd);

  const diffMs = date2.getTime() - date1.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return diffDays; // 29 veya 30
};

/**
 * Hicri tarihe gün ekler/çıkarır
 * @param hijriStr "1446-08-22"
 * @param days Pozitif: ileri, Negatif: geri
 * @returns Yeni Hicri tarih string
 */
export const addHijriDays = (hijriStr: string | null | undefined, days: number): string => {
  // Null-safe: eğer tarih yoksa bugünü kullan
  if (!hijriStr) {
    hijriStr = getCurrentHijriDate();
  }

  // Hicri → Miladi → Tarih aritmetiği → Hicri
  const [hy, hm, hd] = hijriStr.split("-").map(Number);
  const greg = toGregorian(hy, hm, hd);

  const date = new Date(greg.gy, greg.gm - 1, greg.gd);
  date.setDate(date.getDate() + days);

  const newHijri = toHijri(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );

  return `${newHijri.hy}-${pad(newHijri.hm)}-${pad(newHijri.hd)}`;
};

/**
 * İki Hicri tarihi karşılaştırır
 * @returns -1 (h1 < h2), 0 (eşit), 1 (h1 > h2)
 */
export const compareHijriDates = (h1: string, h2: string): number => {
  const [y1, m1, d1] = h1.split("-").map(Number);
  const [y2, m2, d2] = h2.split("-").map(Number);

  if (y1 !== y2) return y1 - y2;
  if (m1 !== m2) return m1 - m2;
  return d1 - d2;
};

/**
 * Hicri tarihi UI formatına çevirir
 * @param hijriStr "1446-08-22"
 * @returns "22 Şaban 1446"
 */
export const formatHijriDate = (hijriStr: string): string => {
  const [hy, hm, hd] = hijriStr.split("-").map(Number);
  const monthName = HIJRI_MONTHS[hm - 1] || "";
  return `${hd} ${monthName} ${hy}`;
};

/**
 * Hicri tarihi kısa UI formatına çevirir (yılsız)
 * @param hijriStr "1446-08-22"
 * @returns "22 Şaban"
 */
export const formatHijriDateShort = (hijriStr: string): string => {
  const [, hm, hd] = hijriStr.split("-").map(Number);
  const monthName = HIJRI_MONTHS[hm - 1] || "";
  return `${hd} ${monthName}`;
};

/**
 * Miladi tarihi formatlar
 * @param gregorianStr "2025-02-15"
 * @returns "15 Şubat 2025"
 */
export const formatGregorianDate = (gregorianStr: string): string => {
  const [y, m, d] = gregorianStr.split("-").map(Number);
  const monthName = GREGORIAN_MONTHS[m - 1] || "";
  return `${d} ${monthName} ${y}`;
};

/**
 * Miladi tarihi kısa formatta döndürür (grafik için)
 * @param gregorianStr "2025-02-15"
 * @returns "15 Şub"
 */
export const formatGregorianDateShort = (gregorianStr: string): string => {
  const [, m, d] = gregorianStr.split("-").map(Number);
  const monthName = GREGORIAN_MONTHS[m - 1]?.slice(0, 3) || "";
  return `${d} ${monthName}`;
};

/**
 * Hicri tarihten ay ve yıl bilgisi çıkarır
 */
export const parseHijriDate = (hijriStr: string | null | undefined) => {
  if (!hijriStr) {
    // Fallback: bugünün tarihi
    hijriStr = getCurrentHijriDate();
  }

  const [hy, hm, hd] = hijriStr.split("-").map(Number);
  return {
    year: hy,
    month: hm,
    day: hd,
    monthName: HIJRI_MONTHS[hm - 1] || "",
    monthShort: HIJRI_MONTHS_SHORT[hm - 1] || "",
  };
};

/**
 * İki Hicri tarih arasındaki tüm günleri döndürür
 * @param startHijri Başlangıç (dahil)
 * @param endHijri Bitiş (dahil)
 * @returns Hicri tarih array'i
 */
export const getHijriDateRange = (startHijri: string, endHijri: string): string[] => {
  const dates: string[] = [];
  let current = startHijri;

  while (compareHijriDates(current, endHijri) <= 0) {
    dates.push(current);
    current = addHijriDays(current, 1);
  }

  return dates;
};
