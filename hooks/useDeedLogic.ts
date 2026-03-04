import { getAmelStatus, IslamicTimeState } from "@/hooks/useTimeEngine";
import { useAppStore } from "@/store/useAppStore";
import { withOpacity } from "@/theme/colors";
import { useColors } from "@/theme/useColors";
import { useMemo } from "react";
import { getCurrentHijriDate } from "@/helpers/hijriUtils";

export const useDeedLogic = (
  item: any,
  engine: IslamicTimeState | null,
  displayDate: string,
) => {
  // const selectedHijriDate = useAppStore((s) => s.selectedHijriDate);
  // Artık dışarıdan gelen (hesaplanmış) tarihi kullanıyoruz
  const selectedHijriDate = displayDate;
  const { card, green } = useColors();
  const viewMode = useAppStore((s) => s.viewMode); // ✅ Buraya taşındı

  // "Bugün" kontrolü: Time Engine varsa effectiveDateHijri (akşamdan sonra yarını gösterir), yoksa sistem saati
  const todayHijri = engine?.effectiveDateHijri || getCurrentHijriDate();

  // Hicri tarih string karşılaştırması ("1446-08-22" < "1446-08-23")
  const isPastDate = selectedHijriDate < todayHijri;
  const isFutureDate = selectedHijriDate > todayHijri;

  const isDone = !!item?.isCompleted;

  const logic = useMemo(() => {
    // 1. Merkezi Time Engine Hesaplaması
    const result = getAmelStatus(engine, item?.startRef, item?.endRef);

    // 2. Renk Mantığı
    const statusColor = item?.statusColor || "#888";

    let baseColor;
    if (isDone) {
      baseColor = green; // ✅ Tamamlandı: Canlı Yeşil
    } else if (viewMode === "info") {
      baseColor = statusColor; // ℹ️ Info Modu: Statü Rengi
    } else {
      // ⬜ Normal: Daha mat ve belirgin bir "Pasif Yeşil" (#84A98C)
      baseColor = "#84A98C";
    }

    // 3. Buton Aktiflik Durumu
    const isButtonActive = (isDone || result.status !== "future") && !isFutureDate;

    return {
      // Time Engine Verileri
      status: result.status,
      statusText: result.text,
      percent: result.percent,

      // UI Verileri
      themeColor: baseColor,
      effectiveColor: baseColor,
      points: item?.deedPoints || 0,

      // Durumlar
      isButtonActive,
    };
  }, [
    item,
    engine,
    card,
    green,
    isDone,
    selectedHijriDate,
    viewMode,
    isFutureDate,
  ]);

  return {
    ...logic,
    isPastDate,
    isFutureDate,
    isDone,
    viewMode,
    green,
  };
};
