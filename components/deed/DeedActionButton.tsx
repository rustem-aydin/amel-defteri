import { useToggleDailyLog } from "@/db/hooks/useToggleDailyLog";
import { useAppStore } from "@/store/useAppStore";
import { useColor } from "@/theme/useColor";
import { Check, Lock } from "lucide-react-native"; // Minus kaldırıldı
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface DeedActionProps {
  status?: string;
  isCompleted: boolean;
  points?: number;
  deedId: number;
  disabled?: boolean;
}

export const DeedActionButton = React.memo(
  ({
    status,
    isCompleted,
    points = 10,
    deedId,
    disabled: externalDisabled,
  }: DeedActionProps) => {
    const selectedDate = useAppStore((s) => s.selectedDate);
    const dateStr = selectedDate as string;
    const activeColor = useColor("active");

    const { mutate: toggleLog, isPending } = useToggleDailyLog();

    const isCompletedBool = !!isCompleted;
    const isLocked = status === "not_started" || status === "locked";
    const isDisabled = isPending || isLocked || externalDisabled;

    let Icon = null;
    let btnStyle: any = {};

    if (isLocked) {
      // Kilitli Durum
      Icon = <Lock size={16} color="#9CA3AF" />;
      btnStyle = styles.btnDisabled;
    } else if (isCompletedBool) {
      Icon = <Check size={24} color="#FFF" strokeWidth={3} />;
      btnStyle = {
        backgroundColor: activeColor, // Arka plan dolu
        borderColor: activeColor,
        borderWidth: 2,
      };
    } else {
      Icon = null;
      btnStyle = {
        backgroundColor: "transparent", // Arka plan şeffaf (boşluk)
        borderColor: activeColor, // Kenarlık rengi
        borderWidth: 2, // Kenarlık kalınlığı
      };
    }

    const handleToggleLog = useCallback(() => {
      if (isDisabled) return;

      toggleLog({
        deedId,
        date: dateStr,
        points,
        currentStatus: isCompletedBool,
      });
    }, [deedId, dateStr, points, isCompletedBool, isDisabled, toggleLog]);

    return (
      <TouchableOpacity
        disabled={isDisabled}
        onPress={handleToggleLog}
        style={[styles.actionBtn, btnStyle]}
        activeOpacity={0.7}
      >
        {Icon}
      </TouchableOpacity>
    );
  },
  (prev, next) => {
    return (
      prev.isCompleted === next.isCompleted &&
      prev.status === next.status &&
      prev.deedId === next.deedId &&
      prev.disabled === next.disabled
    );
  },
);

const styles = StyleSheet.create({
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    // Shadow ayarları (isteğe bağlı, borderlı tasarımda azaltılabilir)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  btnDisabled: {
    backgroundColor: "rgba(150, 150, 150, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.2)",
    shadowOpacity: 0,
    elevation: 0,
  },
});
