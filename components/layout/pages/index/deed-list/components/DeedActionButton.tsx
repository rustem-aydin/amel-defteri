import { useToggleDailyLog } from "@/db/hooks/useAllMutations";
import { compareHijriDates, getCurrentHijriDate } from "@/helpers/hijriUtils";
import { useColor } from "@/theme/useColor";
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
  hijriDate: string;
}

export const DeedActionButton = React.memo(
  ({
    status,
    isCompleted,
    points = 10,
    deedId,
    disabled: externalDisabled,
    imsakTime = "04:30",
    hijriDate,
  }: DeedActionProps) => {
    // 🌙 HİCRİ TARİH: Artık dışarıdan (karttan) gelen tarihi kullanıyoruz
    // Eğer prop gelmezse (undefined ise) bugünü varsay (Güvenlik)
    const todayHijri = getCurrentHijriDate();
    const selectedHijriDate = hijriDate || todayHijri;

    const activeColor = useColor("active");

    const { mutate: toggleLog, isPending } = useToggleDailyLog();

    const { isExpired, isLocked } = useMemo(() => {
      // selectedHijriDate zaten yukarıda tanımlı (todayHijri veya prop)
      // Ancak compareHijriDates'in hata vermemesi için tekrar kontrol ediyoruz
      if (!selectedHijriDate) return { isExpired: false, isLocked: false };

      const comparison = compareHijriDates(selectedHijriDate, todayHijri);

      // 1. Gelecek Tarih Kilidi (Yarın ve sonrası işaretlenemez)
      // ❌ İPTAL: Time Engine zaten vakti gelmemişse "future" veriyor.
      // Eğer akşam ezanı okunduysa ve yatsı "active" ise, tarih yarın olsa bile açık olmalı.
      // if (comparison > 0) {
      //   return { isExpired: false, isLocked: true };
      // }

      // 2. Vakit Kilidi (Henüz vakti gelmemişse kilitli)
      // "future" status'u, vakti henüz gelmemiş (not_started) amelleri temsil eder
      if (
        status === "future" ||
        status === "not_started" ||
        status === "locked"
      ) {
        return { isExpired: false, isLocked: true };
      }

      // 3. Geçmiş Tarih Kontrolü (24 saat geçtiyse kilitli)
      if (comparison < 0) {
        return { isExpired: true, isLocked: true };
      }

      return { isExpired: false, isLocked: false };
    }, [selectedHijriDate, status]);

    const isCompletedBool = !!isCompleted;
    const isDisabled =
      isPending || isLocked || externalDisabled;

    // UI Stil belirlemeleri
    let Icon = null;
    let btnStyle: any = {};

    if (isExpired) {
      // Geçmiş tarih: Her zaman kilit (tamamlanmış olsa bile)
      Icon = <Lock size={16} color="#9CA3AF" />;
      btnStyle = styles.btnDisabled;
    } else if (isCompletedBool) {
      Icon = <Check size={24} color="#FFF" strokeWidth={3} />;
      btnStyle = {
        backgroundColor: activeColor,
        borderColor: activeColor,
        borderWidth: 2,
      };
    } else if (isLocked || (externalDisabled && !isPending)) {
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
        hijriDate: selectedHijriDate, // 🌙 HİCRİ TARİH
        points,
        currentStatus: isCompletedBool,
      });
    }, [
      deedId,
      selectedHijriDate,
      points,
      isCompletedBool,
      isDisabled,
      toggleLog,
    ]);

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
