import { getDeedStatus } from "@/hooks/useDeedStatus";
import { Colors } from "@/theme/colors";
import { isBefore, isSameDay, startOfDay } from "date-fns";
import { useCallback } from "react";

interface UseDeedStatusConfigProps {
  selectedDate: string;
  now: Date;
  references: any;
}

export const useDeedStatusLogic = ({
  selectedDate,
  now,
  references,
}: UseDeedStatusConfigProps) => {
  const getStatusConfig = useCallback(
    (item: any) => {
      const selDateObj = new Date(selectedDate);
      const isPastDate = isBefore(startOfDay(selDateObj), startOfDay(now));
      const isFutureDate = selDateObj > now && !isSameDay(selDateObj, now);

      // Ana mantığı çağır
      const { status, minutesLeft } = getDeedStatus({
        deed: item,
        references,
        isCompleted: !!item.is_completed,
        now,
      });

      let config = {
        status,
        statusText: item.aciklama || "Amel vakti bekleniyor",
        cardStyle: {
          borderColor: "rgba(255,255,255,0.08)",
          backgroundColor: "transparent",
        } as any,
        iconColor: item.renk_kodu || Colors.dark.primary,
        opacity: 1,
        isActionable: false,
        isAlert: false,
      };

      // DURUM YÖNETİMİ
      if (isPastDate) {
        // GEÇMİŞ GÜN
        if (item.is_completed) {
          config.statusText = "Tamamlandı";
          config.cardStyle = {
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.05)",
          };
        } else {
          config.statusText = "Yapılmadı";
          config.isAlert = true;
          config.opacity = 0.6;
        }
      } else if (isFutureDate) {
        // GELECEK GÜN
        config.statusText = "Gelecek Planı";
        config.opacity = 0.4;
      } else {
        // BUGÜN (CANLI MOTOR)
        config.isActionable =
          status === "ACTIVE" ||
          status === "COMPLETED" ||
          status === "ALWAYS_ACTIVE";

        switch (status) {
          case "COMPLETED":
            config.statusText = "Tamamlandı";
            config.cardStyle = {
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.05)",
            };
            break;

          case "ACTIVE":
            config.statusText = `Vaktin çıkmasına ${minutesLeft} dk kaldı`;
            config.cardStyle = {
              borderColor: item.renk_kodu || Colors.dark.primary,
            };
            break;

          case "LOCKED":
            config.statusText = `${minutesLeft} dk sonra başlayacak`;
            config.opacity = 0.5;
            break;

          case "MISSED":
            config.statusText = "Vakti Geçti";
            config.isAlert = true;
            config.opacity = 0.8;
            break;

          case "ALWAYS_ACTIVE":
            config.statusText = item.aciklama || "Gün boyu yapılabilir";
            break;
        }
      }

      return config;
    },
    [selectedDate, now, references]
  );

  return { getStatusConfig };
};
