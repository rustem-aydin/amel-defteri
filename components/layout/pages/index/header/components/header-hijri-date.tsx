import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useDateInfo } from "@/hooks/useDateInfo";
import { useTimeReferences } from "@/context/TimeEngineContext";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { compareHijriDates, formatGregorianDate, hijriToGregorianString } from "@/helpers/hijriUtils";

const HeaderDate = () => {
  const selectedHijriDate = useAppStore((s) => s.selectedHijriDate);

  const engine = useTimeReferences();

  // 🔴 DÜZELTME: Header artık SADECE seçili günü gösterir.
  // TimeEngine'in "akşamdan sonra yarını gösterme" mantığı (effectiveDate)
  // sadece namaz vakitleri ve geri sayım içindir.
  // Takvimde seçilen gün neyse, başlıkta o yazmalıdır.

  // Seçili tarih yoksa bugünün efektif Hicri tarihini baz al
  const effectiveHijriToday = useAppStore((s) => s.effectiveHijriToday);
  const displayDate = selectedHijriDate || effectiveHijriToday;

  // Akşam modu (sadece bugün için özel ikon vs istenirse kullanılabilir)
  // ama tarihi değiştirmemeli.
  const isPostMaghrib =
     engine && compareHijriDates(displayDate, engine.actualDateHijri) === 0
       ? engine.isPostMaghrib
       : false;

  // Date Info Hook
  const { hijri, specialDayName, isSpecial, dayLabel } = useDateInfo(
    displayDate,
    isPostMaghrib, // Bu sadece "Cuma Gecesi" gibi etiketleri etkiler, tarihi değil
  );

  // Miladi karşılığı
  const gregorianDate = hijriToGregorianString(displayDate);

  return (
    <View style={styles.container}>
      {/* SATIR 1: HİCRİ TARİH (Büyük) */}
      <Text
        style={[styles.hijriText, { color: isSpecial ? "#d4af37" : "white" }]}
      >
        {hijri?.fullDate}
      </Text>

      {/* SATIR 2: Gün ve Vakit + Miladi Tarih */}
      <View style={styles.subRow}>
        <Text style={styles.dayLabelText}>{dayLabel}</Text>
        <Text style={styles.gregorianHint}> • {formatGregorianDate(gregorianDate).slice(0, 5)}</Text>
      </View>

      {/* SATIR 3: Özel Gün Badge */}
      {isSpecial && specialDayName && (
        <View style={styles.specialBadgeContainer}>
          <Ionicons name="sparkles" size={10} color="#fff" />
          <Text style={styles.specialBadgeText}>{specialDayName}</Text>
        </View>
      )}
    </View>
  );
};

export default HeaderDate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 4,
  },
  hijriText: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subRow: {
    flexDirection: "row",
    marginTop: -2,
    alignItems: "center",
  },
  dayLabelText: {
    color: "#A0A0A0",
    fontSize: 13,
    fontWeight: "600",
  },
  gregorianHint: {
    color: "#808080",
    fontSize: 11,
    fontWeight: "400",
  },
  specialBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d4af37",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  specialBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
    textTransform: "uppercase",
  },
});
