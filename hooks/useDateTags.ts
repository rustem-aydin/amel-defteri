import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toHijri } from "hijri-converter";
import { useMemo } from "react";

const HIJRI_MONTHS = [
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

interface DateInfoResult {
  tags: string[];
  hijri: {
    day: number;
    month: number;
    year: number;
    monthName: string;
    fullDate: string;
  } | null;
  specialDayName: string | null;
  isSpecial: boolean;
  dayLabel: string; // YENİ: "Pazar Sabahı" veya "Pazartesi Akşamı"
}

export const useDateInfo = (
  dateParam: Date | string | number | undefined | null,
  isPostMaghrib: boolean = false, // YENİ: Akşam ezanı bilgisi
): DateInfoResult => {
  const result = useMemo(() => {
    const defaultResult: DateInfoResult = {
      tags: ["DAILY"],
      hijri: null,
      specialDayName: null,
      isSpecial: false,
      dayLabel: "",
    };

    if (!dateParam) return defaultResult;

    const date = new Date(dateParam);
    if (isNaN(date.getTime())) return defaultResult;

    // --- 1. ETİKET VE GÜN ADI MANTIĞI ---
    const tags = ["DAILY"];
    let specialDayName: string | null = null;

    // Günün ismini al (Örn: Pazar veya Pazartesi)
    const dayName = format(date, "EEEE", { locale: tr });

    // Etiketi oluştur
    // Eğer akşam olduysa (isPostMaghrib) ve tarih "Efektif Tarih" ise:
    // "Pazartesi Gecesi" (İslami olarak gece önden gelir)
    let dayLabel = "";
    if (isPostMaghrib) {
      dayLabel = `${dayName} Gecesi 🌙`;
    } else {
      dayLabel = `${dayName} Günü ☀️`;
    }

    // --- 2. HAFTALIK KONTROLLER ---
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 5) {
      tags.push("WEEKLY_FRI");
      // Eğer özel bir gün adı yoksa ve Cuma ise
      if (!isPostMaghrib) specialDayName = "Hayırlı Cumalar";
      else specialDayName = "Cuma Gecesi"; // Perşembe akşamı girildiğinde
    }
    if (dayOfWeek === 1 || dayOfWeek === 4) tags.push("WEEKLY_MON_THU");

    // --- 3. HİCRİ HESAPLAMA ---
    const hijri = toHijri(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

    const monthName = HIJRI_MONTHS[hijri.hm - 1] || "";
    const fullHijriDate = `${hijri.hd} ${monthName} ${hijri.hy}`;

    // --- 4. ÖZEL GÜN KONTROLLERİ ---
    // Üç aylar
    if (hijri.hm === 7 || hijri.hm === 8 || hijri.hm === 9)
      tags.push("SEASON_THREE_MONTHS");

    // Ramazan ve Kadir Gecesi
    if (hijri.hm === 9) {
      tags.push("YEARLY_RAMADAN");
      if (hijri.hd === 27) {
        tags.push("SPECIAL_QADR");
        specialDayName = "Kadir Gecesi";
      } else if (!specialDayName) {
        specialDayName = "Ramazan-ı Şerif";
      }
    }

    // Kandiller
    if (hijri.hm === 7 && hijri.hd === 27) {
      tags.push("SPECIAL_MIRAC");
      specialDayName = "Miraç Kandili";
    }
    if (hijri.hm === 8 && hijri.hd === 15) {
      tags.push("SPECIAL_BERAT");
      specialDayName = "Berat Kandili";
    }
    if (hijri.hm === 3 && hijri.hd === 12) {
      tags.push("SPECIAL_MEVLID");
      specialDayName = "Mevlid Kandili";
    }
    if (hijri.hm === 7 && hijri.hd === 1) {
      // Regaip genellikle Receb'in ilk Cuma gecesidir, tarih değişebilir ama sabit mantık eklenebilir.
      // Regaip hesaplaması karmaşıktır, burayı basit tuttum.
    }

    // Bayramlar
    if (hijri.hm === 10) {
      if (hijri.hd === 1) {
        tags.push("EID_RAMADAN");
        specialDayName = "Ramazan Bayramı 1. Gün";
      } else if (hijri.hd === 2) {
        tags.push("EID_RAMADAN");
        specialDayName = "Ramazan Bayramı 2. Gün";
      } else if (hijri.hd === 3) {
        tags.push("EID_RAMADAN");
        specialDayName = "Ramazan Bayramı 3. Gün";
      }
    }

    if (hijri.hm === 12) {
      if (hijri.hd === 9) {
        tags.push("SPECIAL_AREFE");
        specialDayName = "Arefe Günü";
      } else if (hijri.hd === 10) {
        tags.push("EID_ADHA");
        specialDayName = "Kurban Bayramı 1. Gün";
      } else if (hijri.hd > 10 && hijri.hd <= 13) {
        tags.push("EID_ADHA");
        specialDayName = `Kurban Bayramı ${hijri.hd - 9}. Gün`;
      }

      if (hijri.hd < 9 && !specialDayName) {
        tags.push("SEASON_ZULHIJJAH_10");
        specialDayName = "Zilhicce (İlk 10 Gün)";
      }
    }

    if (hijri.hm === 1 && hijri.hd === 10) {
      tags.push("SPECIAL_ASHURA");
      specialDayName = "Aşure Günü";
    }

    return {
      tags,
      hijri: {
        day: hijri.hd,
        month: hijri.hm,
        year: hijri.hy,
        monthName,
        fullDate: fullHijriDate,
      },
      specialDayName,
      isSpecial: !!specialDayName || tags.length > 2,
      dayLabel,
    };
  }, [dateParam, isPostMaghrib]);

  return result;
};
