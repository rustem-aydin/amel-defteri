import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useMemo } from "react";
import {
  compareHijriDates,
  hijriStringToGregorianDate,
  parseHijriDate,
} from "@/helpers/hijriUtils";
import { useAppStore } from "@/store/useAppStore";

// --- SABİTLER ---

const HIJRI_MONTHS = [
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

export interface DateInfoResult {
  // UI İçin
  hijri: {
    day: number;
    month: number;
    year: number;
    monthName: string;
    fullDate: string; // "14 Şaban 1447"
  };
  dayLabel: string; // "Pazartesi Gecesi 🌙" veya "Pazar Günü ☀️"
  specialDayName: string | null; // "BERAT KANDİLİ ✨"
  isSpecial: boolean; // Badge gösterilecek mi?

  // Logic/DB İçin
  tags: string[]; // ["DAILY", "WEEKLY_FRI", "SPECIAL_BERAT"]
  multiplier: number; // Sevap katsayısı (Cuma: 2x, Ramazan: 10x vb.)
}

/**
 * Hicri tarih bilgilerini döndürür
 * @param hijriDateStr "1446-08-22" formatında Hicri tarih
 * @param isPostMaghrib Akşam ezanı sonrası mı?
 */
export const useDateInfo = (
  hijriDateStr: string | undefined | null,
  isPostMaghrib: boolean = false,
): DateInfoResult => {
  const effectiveHijriToday = useAppStore((s) => s.effectiveHijriToday);
  const result = useMemo<DateInfoResult>(() => {
    // 1. Varsayılan Boş Değerler
    const defaultResult: DateInfoResult = {
      hijri: {
        day: 1,
        month: 1,
        year: 1446,
        monthName: "Muharrem",
        fullDate: "",
      },
      dayLabel: "",
      specialDayName: null,
      isSpecial: false,
      tags: ["DAILY"],
      multiplier: 1,
    };

    if (!hijriDateStr) return defaultResult;

    // Hicri tarihi parse et
    const { year: hy, month: hm, day: hd, monthName } = parseHijriDate(hijriDateStr);
    const fullDate = `${hd} ${monthName} ${hy}`;

    // Miladi karşılığını bul (gün adı için)
    const gregorianDate = hijriStringToGregorianDate(hijriDateStr);
    let dayName = format(gregorianDate, "EEEE", { locale: tr }); // "Pazartesi"

    // --- 2. GÜN ETİKETLEME (Header Satır 2) ---

    // Önce seçilen günün "Bugün" olup olmadığına bakalım
    const isCalendarToday = hijriDateStr
      ? compareHijriDates(hijriDateStr, effectiveHijriToday) === 0
      : false;

    // Varsayılan: Normal Gün Adı (Örn: "Pazartesi")
    let dayLabel = dayName;

    // Sadece "Bugün" (isCalendarToday = true) seçiliyse, özel vakit mantığını kullan:
    if (isCalendarToday) {
      if (isPostMaghrib) {
        // Eğer Miladi güne ait Hicri karşılığı kullanılıp, geceye geçilmişse (ki header buna düşüyor),
        // Bir sonraki günün adını bularak "Gecesi" göster.
        const nextDay = new Date(gregorianDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayName = format(nextDay, "EEEE", { locale: tr });
        dayLabel = `${nextDayName} Gecesi 🌙`;
      } else {
        // Bugün Gündüz -> Bugün Günü
        dayLabel = `${dayName} Günü ☀️`;
      }
    } else {
      // DİĞER GÜNLER (Geçmiş veya Gelecek)
      // Sadece çıplak gün ismini kullan ve bu noktada isPostMaghrib parametresini yoksay!
      dayLabel = dayName;
    }

    // --- 3. ÖZEL GÜN ANALİZİ (Badge ve Tags) ---
    const tags = ["DAILY"];
    let specialDayName: string | null = null;
    let multiplier = 1;
    let isSpecial = false;

    // A) Haftalık Kontroller (Gregorian day index)
    // Cuma için gece mantığı - Sadece "Bugün" ise ve "isPostMaghrib" doğruysa Perşembe akşamını "CUMA GECESİ" say
    let logicDate = gregorianDate;
    if (isCalendarToday && isPostMaghrib) {
      logicDate = new Date(gregorianDate);
      logicDate.setDate(logicDate.getDate() + 1);
    }
    const dayIndex = logicDate.getDay();

    // Cuma
    if (dayIndex === 5) {
      tags.push("WEEKLY_FRI");
      multiplier = 2;
      if (!specialDayName) {
        specialDayName = (isCalendarToday && isPostMaghrib) ? "CUMA GECESİ" : "CUMA BEREKETİ";
        isSpecial = true;
      }
    }

    // Pzt / Prş (Sünnet Orucu günleri)
    if (dayIndex === 1 || dayIndex === 4) {
      tags.push("WEEKLY_MON_THU");
    }

    // B) Yıllık / Hicri Kontroller

    // Üç Aylar (Receb, Şaban, Ramazan)
    if ([7, 8, 9].includes(hm)) {
      tags.push("SEASON_3_MONTHS");
    }

    // RAMAZAN
    if (hm === 9) {
      tags.push("YEARLY_RAMADAN");
      multiplier = 10;
      specialDayName = "RAMAZAN-I ŞERİF";
      isSpecial = true;

      // Kadir Gecesi (27. Gece)
      if (hd === 27) {
        tags.push("SPECIAL_QADR");
        specialDayName = "✨ KADİR GECESİ";
        multiplier = 1000;
      }
    }

    // KANDİLLER
    // Miraç (Receb 27)
    if (hm === 7 && hd === 27) {
      tags.push("SPECIAL_MIRAC");
      specialDayName = "✨ MİRAÇ KANDİLİ";
      isSpecial = true;
    }

    // Berat (Şaban 15)
    if (hm === 8 && hd === 15) {
      tags.push("SPECIAL_BERAT");
      specialDayName = "✨ BERAT KANDİLİ";
      isSpecial = true;
    }

    // Mevlid (Rebiülevvel 12)
    if (hm === 3 && hd === 12) {
      tags.push("SPECIAL_MEVLID");
      specialDayName = "✨ MEVLİD KANDİLİ";
      isSpecial = true;
    }

    // Arefe ve Kurban (Zilhicce)
    if (hm === 12) {
      if (hd === 9) {
        tags.push("SPECIAL_AREFE");
        specialDayName = "AREFE GÜNÜ";
        isSpecial = true;
      } else if (hd >= 10 && hd <= 13) {
        tags.push("EID_ADHA");
        specialDayName = `KURBAN BAYRAMI ${hd - 9}. GÜN`;
        isSpecial = true;
      } else if (hd < 9) {
        tags.push("SEASON_ZULHIJJAH_10");
        if (!specialDayName) specialDayName = "ZİLHİCCE İLK 10 GÜN";
        isSpecial = true;
      }
    }

    // Aşure (Muharrem 10)
    if (hm === 1 && hd === 10) {
      tags.push("SPECIAL_ASHURA");
      specialDayName = "AŞURE GÜNÜ";
      isSpecial = true;
    }

    return {
      hijri: {
        day: hd,
        month: hm,
        year: hy,
        monthName,
        fullDate,
      },
      dayLabel,
      specialDayName,
      isSpecial,
      tags,
      multiplier,
    };
  }, [hijriDateStr, isPostMaghrib, effectiveHijriToday]);

  return result;
};
