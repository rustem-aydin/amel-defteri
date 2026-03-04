import { Text } from "@/components/ui/text";
import { getAmelStatus, TimeRefs } from "@/hooks/useTimeEngine";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

interface Props {
  start_ref: keyof TimeRefs | null | undefined;
  end_ref: keyof TimeRefs | null | undefined;
  engine: any;
}

export const DeedTime = ({ start_ref, end_ref, engine }: Props) => {
  const [, setTick] = useState(0);

  // Saniye başı render tetikleyicisi
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // 1. Status hesaplama
  const result = getAmelStatus(engine, start_ref, end_ref);

  // Güvenlik: result undefined veya null ise default değer ata
  const {
    status = "loading",
    text = "--:--",
    message = "",
    color = "#9CA3AF",
  } = result || {};

  // 2. HATA ÇÖZÜMÜ: replace yapmadan önce message'ın varlığını kontrol et
  const cleanMessage = message ? message.replace(":", "").trim() : "";

  const timeData = useMemo(() => {
    if (["active", "not_started", "future", "all_day"].includes(status)) {
      // text formatı "02:15" gibi bekleniyor
      const parts = text ? text.split(":") : [];
      if (parts.length >= 2) {
        return {
          h: parseInt(parts[0], 10),
          m: parseInt(parts[1], 10),
          isValid: true,
        };
      }
    }
    return { h: 0, m: 0, isValid: false };
  }, [text, status]);

  const digitStyle = {
    fontSize: 15,
    fontWeight: "bold" as const,
    color: color,
    includeFontPadding: false,
    textAlignVertical: "center" as const,
  };

  const labelStyle = {
    ...digitStyle,
    fontSize: 14,
    marginLeft: 2,
    marginRight: 6,
    fontWeight: "normal" as const,
  };

  // Eğer saat formatında değilse (örn: "Vakit Çıktı") düz metin dön
  if (!timeData.isValid) return <Text style={digitStyle}>{text}</Text>;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {/* Mesaj (Kalan/Sonra) */}
      {cleanMessage !== "" && (
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
      )}

      {/* Saat ve Dakika Gösterimi */}
      <View style={{ flexDirection: "row", alignItems: "center", height: 24 }}>
        <Text style={digitStyle}>{timeData.h}</Text>
        <Text style={labelStyle}>saat</Text>
        <Text style={digitStyle}>{timeData.m}</Text>
        <Text style={[labelStyle, { marginRight: 0 }]}>dakika</Text>
      </View>
    </View>
  );
};
