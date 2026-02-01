import { Text } from "@/components/ui/text";
import { getAmelStatus, TimeRefs } from "@/hooks/useTimeEngine";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

interface Props {
  start_ref: keyof TimeRefs | null | undefined;
  end_ref: keyof TimeRefs | null | undefined;
  references: any;
}

export const DeedTime = ({ start_ref, end_ref, references }: Props) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const { status, text, message, color } = getAmelStatus(
    references,
    start_ref,
    end_ref,
  );
  const cleanMessage = message.replace(":", "").trim();

  const timeData = useMemo(() => {
    if (["active", "not_started", "all_day"].includes(status)) {
      const parts = text.split(":");
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

  if (!timeData.isValid) return <Text style={digitStyle}>{text}</Text>;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
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
      <View style={{ flexDirection: "row", alignItems: "center", height: 24 }}>
        <Text style={digitStyle}>{timeData.h}</Text>
        <Text style={labelStyle}>saat</Text>
        <Text style={digitStyle}>{timeData.m}</Text>
        <Text style={[labelStyle, { marginRight: 0 }]}>dakika</Text>
      </View>
    </View>
  );
};
