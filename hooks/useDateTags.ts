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
}

export const useDateInfo = (
  dateParam: Date | string | number | undefined | null,
): DateInfoResult => {
  const result = useMemo(() => {
    // Varsayılan boş dönüş
    const defaultResult: DateInfoResult = {
      tags: ["DAILY"],
      hijri: null,
      specialDayName: null,
      isSpecial: false,
    };

    if (!dateParam) return defaultResult;

    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return defaultResult;
    }

    const tags = ["DAILY"];
    let specialDayName: string | null = null;

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 5) tags.push("WEEKLY_FRI");
    if (dayOfWeek === 1 || dayOfWeek === 4) tags.push("WEEKLY_MON_THU");

    const hijri = toHijri(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

    const monthName = HIJRI_MONTHS[hijri.hm - 1] || "";
    const fullHijriDate = `${hijri.hd} ${monthName} ${hijri.hy}`;

    if (hijri.hm === 7 || hijri.hm === 8 || hijri.hm === 9) {
      tags.push("SEASON_THREE_MONTHS");
    }

    if (hijri.hm === 9) {
      tags.push("YEARLY_RAMADAN");

      if (hijri.hd === 27) {
        tags.push("SPECIAL_QADR");
        specialDayName = "Kadir Gecesi";
      }
    }

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
      if (hijri.hd === 10) {
        tags.push("EID_ADHA");
        specialDayName = "Kurban Bayramı 1. Gün";
      } else if (hijri.hd > 10 && hijri.hd <= 13) {
        tags.push("EID_ADHA");
        specialDayName = `Kurban Bayramı ${hijri.hd - 9}. Gün`;
      }
    }

    if (hijri.hm === 12 && hijri.hd <= 10 && !specialDayName) {
      tags.push("SEASON_ZULHIJJAH_10");
      if (hijri.hd < 10) specialDayName = "Zilhicce Ayı (İlk 10 Gün)";
    }

    if (hijri.hm === 1 && hijri.hd === 10) {
      tags.push("SPECIAL_ASHURA");
      specialDayName = "Aşure Günü";
    }

    if (!specialDayName && dayOfWeek === 5) {
      specialDayName = "Hayırlı Cumalar";
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
    };
  }, [dateParam]);

  return result;
};
