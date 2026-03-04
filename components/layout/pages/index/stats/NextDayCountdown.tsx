import { Text } from "@/components/ui/text";
import { useTimeReferences } from "@/context/TimeEngineContext";
import { addHijriDays, formatHijriDateShort } from "@/helpers/hijriUtils";
import { useAppStore } from "@/store/useAppStore";
import { useColors } from "@/theme/useColors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export const NextDayCountdown = () => {
  const engine = useTimeReferences();
  const { card, cardBorder, iconBg } = useColors();

  // App store'dan seçili tarihi ve bugünün efektif tarihini alıyoruz
  const selectedHijriDate = useAppStore((s) => s.selectedHijriDate);
  const effectiveHijriToday = useAppStore((s) => s.effectiveHijriToday);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!engine?.refs?.MAGHRIB || !engine?.now) return;

    let targetTime = engine.refs.MAGHRIB.getTime();

    if (engine.isPostMaghrib || Date.now() > targetTime) {
      targetTime += 24 * 60 * 60 * 1000;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [engine?.refs?.MAGHRIB, engine?.now, engine?.isPostMaghrib]);

  if (!engine) return null;

  // 1. KONTROL: Yatay takvimden şimdiki günden (effectiveHijriToday) FARKLI bir gün seçilmişse sayaç null dönmeli (gözükmemeli)
  if (selectedHijriDate !== effectiveHijriToday) {
    return null;
  }

  if (engine.isPostMaghrib) return null;

  // "12 Ramazan'a Kalan" formülü (+1 gün mantığı ile)
  let targetHijriDate = engine.effectiveDateHijri;
  if (targetHijriDate) {
    targetHijriDate = addHijriDays(targetHijriDate, 1);
  }

  const nextDayName = targetHijriDate
    ? formatHijriDateShort(targetHijriDate)
    : "Yeni Güne";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: card,
          borderColor: cardBorder,
        },
      ]}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Ionicons name="moon" size={18} color="gold" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Gün Dönümü</Text>
          <Text style={styles.subtitle}>{nextDayName}'a Kalan</Text>
        </View>
      </View>

      <View style={styles.countdownContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>
            {String(timeLeft.hours).padStart(2, "0")}
          </Text>
          <Text style={styles.timeLabel}>sa</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>
            {String(timeLeft.minutes).padStart(2, "0")}
          </Text>
          <Text style={styles.timeLabel}>dk</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>
            {String(timeLeft.seconds).padStart(2, "0")}
          </Text>
          <Text style={styles.timeLabel}>sn</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 2,
  },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeBlock: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 24,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
    color: "white",
  },
  timeLabel: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: -2,
  },
  separator: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#94a3b8",
    marginHorizontal: 4,
    marginBottom: 8,
  },
});
