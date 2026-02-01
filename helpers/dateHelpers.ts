// utils/dateHelpers.ts
import { toHijri } from "hijri-converter";

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

// Basitçe o gün için rastgele ameller dönen bir mock fonksiyon
const getDeedsForDay = (specialDayName: string) => {
  // Gerçek uygulamada burası DB'den gelir
  if (!specialDayName) return [];
  return [
    {
      id: 1,
      title: "Nafile Oruç",
      subtitle: "Sünnet / Faziletli",
      type: "sunnah",
    },
    {
      id: 2,
      title: "Tesbih Namazı",
      subtitle: "Nafile İbadet",
      type: "sunnah",
    },
    {
      id: 3,
      title: "Kuran-ı Kerim Tilaveti",
      subtitle: "Müstahab",
      type: "sunnah",
    },
    { id: 4, title: "Dua ve İstiğfar", subtitle: "Zikir", type: "dua" },
  ];
};

export const getHijriDateInfo = (dateParam: Date | string | number) => {
  const date = new Date(dateParam);
  if (isNaN(date.getTime())) return null;

  const tags = ["DAILY"];
  let specialDayName: string | null = null;

  // ... (Buradaki mantık önceki cevaplardaki ile aynı kalabilir) ...
  // Hızlı test için örnek manuel atama:
  const hijri = toHijri(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  const monthName = HIJRI_MONTHS[hijri.hm - 1] || "";
  const fullHijriDate = `${hijri.hd} ${monthName} ${hijri.hy}`;

  // ÖRNEK MANTIK (Test için)
  if (hijri.hm === 9) specialDayName = "Ramazan Ayı";
  if (hijri.hm === 9 && hijri.hd === 27) specialDayName = "Kadir Gecesi";
  if (hijri.hm === 10 && hijri.hd === 1) specialDayName = "Ramazan Bayramı";

  // Eğer özel gün değilse null dönsün ki listede çıkmasın (veya Cuma ise ekle)
  if (!specialDayName && date.getDay() === 5) specialDayName = "Cuma Günü";

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
    isSpecial: !!specialDayName,
    deeds: specialDayName ? getDeedsForDay(specialDayName) : [],
  };
};
