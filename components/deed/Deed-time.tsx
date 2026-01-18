import { getAmelStatus, TimeRefs, useTimeEngine } from "@/hooks/useTimeEngine";
import { useLocationStore } from "@/store/useLocationStore";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { Easing } from "react-native-reanimated";
import { Text } from "../ui/text";
import { View } from "../ui/view";

interface Props {
  start_ref: keyof TimeRefs | null | undefined;
  end_ref: keyof TimeRefs | null | undefined;
}

export const DeedTime = ({ start_ref, end_ref }: Props) => {
  const coords = useLocationStore((s) => s.coords);
  const references = useTimeEngine(coords);

  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { status, text, message, color } = getAmelStatus(
    references,
    start_ref,
    end_ref,
  );
  const cleanMessage = message.replace(":", "").trim();

  // 4. Zamanı (HH:mm:ss) sayısal parçalara ayır
  const timeData = useMemo(() => {
    // Sadece zaman sayılan durumlarda parse işlemi yap
    if (
      status === "active" ||
      status === "not_started" ||
      status === "all_day"
    ) {
      const parts = text.split(":");
      if (parts.length === 3) {
        return {
          h: parseInt(parts[0], 10),
          m: parseInt(parts[1], 10),
          s: parseInt(parts[2], 10),
          isValid: true,
        };
      }
    }
    return { h: 0, m: 0, s: 0, isValid: false };
  }, [text, status]);

  // Rakamların stili
  const digitStyle = {
    fontSize: 15,
    fontWeight: "bold" as const,
    color: color,
    // Android'de sayıların dikey hizalamasını düzeltmek için
    includeFontPadding: false,
    textAlignVertical: "center" as const,
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* Mesaj Kısmı (Örn: Başlamasına) */}
      <Text
        style={{
          fontSize: 14,
          color: color,
          fontWeight: "600",
          marginRight: 6,
        }}
      >
        {cleanMessage}
      </Text>

      {/* Saat Kısmı */}
      {timeData.isValid ? (
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 24 }}
        >
          {/* SAAT */}
          <TimeSlot value={timeData.h} style={digitStyle} />

          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: color,
              marginHorizontal: 1,
            }}
          >
            :
          </Text>

          {/* DAKİKA */}
          <TimeSlot value={timeData.m} style={digitStyle} />

          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: color,
              marginHorizontal: 1,
            }}
          >
            :
          </Text>

          {/* SANİYE */}
          <TimeSlot value={timeData.s} style={digitStyle} />
        </View>
      ) : (
        // Süre doldu veya hata durumu (Sabit Text)
        <Text style={digitStyle}>{text}</Text>
      )}
    </View>
  );
};

// Tekrar eden kodları önlemek için ufak bir yardımcı bileşen
const TimeSlot = ({ value, style }: { value: number; style: any }) => {
  return (
    // Eğer sayı 10'dan küçükse başına manuel '0' eklemek için View hilesi
    // Not: Kütüphane genellikle '05' değil '5' basar, bu yüzden görsel düzenleme gerekebilir.
    // Ancak basitlik adına direkt value veriyoruz.
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {value < 10 && <Text style={style}>0</Text>}
      <AnimatedRollingNumber
        value={value}
        textStyle={style}
        spinningAnimationConfig={{
          duration: 400,
          easing: Easing.out(Easing.ease), // Saat için daha yumuşak geçiş
        }}
      />
    </View>
  );
};
