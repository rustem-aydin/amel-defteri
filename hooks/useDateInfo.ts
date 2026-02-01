import {
  getDateAttributes,
  HIJRI_MONTHS,
  PERIOD_CODES,
} from "@/helpers/dateUtils"; // veya "@/utils/dateUtils"
import { useMemo } from "react";

export const useDateInfo = (
  dateParam: Date | string | number | undefined | null,
) => {
  return useMemo(() => {
    // 1. Boş kontrolü
    if (!dateParam) return null;

    // 2. TİP DÖNÜŞÜMÜ (Type Error Çözümü)
    // Gelen veri number (timestamp), string veya Date olabilir.
    // Hepsini Date objesine çeviriyoruz.
    const dateObj = new Date(dateParam);

    // Geçersiz tarih kontrolü (örn: "invalid-date" gelirse)
    if (isNaN(dateObj.getTime())) return null;

    // 3. Utils fonksiyonuna artık kesinlikle 'Date' objesi gidiyor
    const { hijri, tags } = getDateAttributes(dateObj);

    // UI için özel gün ismini belirle
    let specialDayName: string | null = null;

    if (tags.includes(PERIOD_CODES.SPECIAL_QADR))
      specialDayName = "Kadir Gecesi";
    else if (tags.includes(PERIOD_CODES.SPECIAL_MIRAC))
      specialDayName = "Miraç Kandili";
    else if (tags.includes(PERIOD_CODES.SPECIAL_BERAT))
      specialDayName = "Berat Kandili";
    else if (tags.includes(PERIOD_CODES.SPECIAL_MEVLID))
      specialDayName = "Mevlid Kandili";
    else if (tags.includes(PERIOD_CODES.SPECIAL_ASHURA))
      specialDayName = "Aşure Günü";
    else if (tags.includes(PERIOD_CODES.SPECIAL_AREFE))
      specialDayName = "Arefe Günü";
    else if (tags.includes(PERIOD_CODES.EID_RAMADAN))
      specialDayName = `Ramazan Bayramı ${hijri.hd}. Gün`;
    else if (tags.includes(PERIOD_CODES.EID_ADHA))
      specialDayName = `Kurban Bayramı ${hijri.hd - 9}. Gün`;
    else if (!specialDayName && tags.includes(PERIOD_CODES.WEEKLY_FRI))
      specialDayName = "Hayırlı Cumalar";

    return {
      tags,
      hijri: {
        ...hijri,
        monthName: HIJRI_MONTHS[hijri.hm - 1],
        fullDate: `${hijri.hd} ${HIJRI_MONTHS[hijri.hm - 1]} ${hijri.hy}`,
      },
      specialDayName,
      isSpecial: !!specialDayName || tags.length > 2,
    };
  }, [dateParam]);
};
