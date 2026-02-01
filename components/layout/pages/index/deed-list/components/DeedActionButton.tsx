import { useToggleDailyLog } from "@/db/hooks/useAllMutations";
import { useAppStore } from "@/store/useAppStore";
import { useColor } from "@/theme/useColor";
import { addDays, isAfter, parseISO } from "date-fns";
import { Check, Lock } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface DeedActionProps {
  status?: string;
  isCompleted: boolean;
  points?: number;
  deedId: number;
  disabled?: boolean;
  imsakTime?: string;
}

export const DeedActionButton = React.memo(
  ({
    status,
    isCompleted,
    points = 10,
    deedId,
    disabled: externalDisabled,
    imsakTime = "04:30",
  }: DeedActionProps) => {
    const selectedDate = useAppStore((s) => s.selectedDate);

    const activeColor = useColor("active");

    const { mutate: toggleLog, isPending } = useToggleDailyLog();

    const isExpired = useMemo(() => {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      if (selectedDate > todayStr) return false;
      if (selectedDate === todayStr) return false;

      const [h, m] = imsakTime.split(":").map(Number);
      const deadline = addDays(parseISO(selectedDate), 1);
      deadline.setHours(h, m, 0, 0);

      return isAfter(now, deadline);
    }, [selectedDate, imsakTime]);

    const isCompletedBool = !!isCompleted;

    const isLocked =
      status === "not_started" ||
      status === "locked" ||
      (isExpired && !isCompletedBool);

    const isDisabled = isPending || isLocked || externalDisabled;

    // UI Stil belirlemeleri
    let Icon = null;
    let btnStyle: any = {};

    if (isCompletedBool) {
      Icon = <Check size={24} color="#FFF" strokeWidth={3} />;
      btnStyle = {
        backgroundColor: isExpired ? "#9CA3AF" : activeColor,
        borderColor: isExpired ? "#9CA3AF" : activeColor,
        borderWidth: 2,
      };
    } else if (isLocked) {
      Icon = <Lock size={16} color="#9CA3AF" />;
      btnStyle = styles.btnDisabled;
    } else {
      btnStyle = {
        backgroundColor: "transparent",
        borderColor: activeColor,
        borderWidth: 2,
      };
    }

    const handleToggleLog = useCallback(() => {
      if (isDisabled) return;
      toggleLog({
        deedId,
        date: selectedDate,
        points,
        currentStatus: isCompletedBool,
      });
    }, [deedId, selectedDate, points, isCompletedBool, isDisabled, toggleLog]);

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
);

const styles = StyleSheet.create({
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "rgba(150, 150, 150, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.2)",
  },
});
