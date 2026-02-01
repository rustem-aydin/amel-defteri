import { getAmelStatus } from "@/hooks/useTimeEngine";
import { useAppStore } from "@/store/useAppStore";
import { withOpacity } from "@/theme/colors";
import { useColors } from "@/theme/useColors";
import { useMemo } from "react";

export const useDeedLogic = (item: any, references: any) => {
  const selectedDate = useAppStore((s) => s.selectedDate);
  const viewMode = useAppStore((s) => s.viewMode);
  const { card, green } = useColors();

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const isPastDate = selectedDate < todayStr;
  const isDone = !!item?.isCompleted;

  const logic = useMemo(() => {
    const originalThemeColor = item?.statusColor || "#4F46E5";
    const { status } = getAmelStatus(references, item?.startRef, item?.endRef);

    const isInfoMode = viewMode === "info";

    // Renk mantığı
    let usedColor = originalThemeColor;
    if (!isInfoMode) {
      usedColor = isDone ? green : withOpacity(green, 0.4);
    } else {
      usedColor = isDone ? green : withOpacity(green, 0.4);
    }

    let containerBorderColor = isDone ? green : usedColor;
    const containerOpacity = isDone ? 1 : 0.6;

    return {
      status,
      themeColor: originalThemeColor,
      effectiveColor: usedColor,
      points: item?.deedPoints || 0,
      isButtonActive: status !== "not_started",
      containerStyle: {
        backgroundColor: card,
        borderColor: containerBorderColor,
        opacity: containerOpacity,
      },
    };
  }, [item, references, card, green, isDone, viewMode]);

  return {
    ...logic,
    isPastDate,
    isDone,
    viewMode,
    green, // UI bileşenlerine geçmek için
  };
};
