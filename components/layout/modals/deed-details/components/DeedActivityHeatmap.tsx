import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { usegetDeedCompletedDates } from "@/db/hooks/useAllQueries";
import {
  getCurrentHijriDate,
  getHijriMonthLength,
  HIJRI_MONTHS_SHORT,
  parseHijriDate,
} from "@/helpers/hijriUtils";
import { useColors } from "@/theme/useColors";
import React, { memo, useMemo } from "react";
import { Dimensions, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PADDING = 60;
const DAY_COUNT = 30; // Hicri aylar maks 30 çeker
const LABEL_WIDTH = 22;
const GAP = 2;

const CELL_WIDTH =
  (SCREEN_WIDTH - PADDING - LABEL_WIDTH - DAY_COUNT * GAP) / DAY_COUNT;
const CELL_HEIGHT = CELL_WIDTH * 2.6;

export const DeedActivityHeatmap = memo(({ id }: { id: number }) => {
  const { card, cardBorder, active, textMuted } = useColors();

  // 🌙 Mevcut Hicri Yıl
  const currentHijri = useMemo(() => getCurrentHijriDate(), []);
  const { year } = parseHijriDate(currentHijri);

  const { data: completedDates, isLoading } = usegetDeedCompletedDates(id);

  const grid = useMemo(() => {
    return HIJRI_MONTHS_SHORT.map((monthName, monthIndex) => {
      // Hicri aylar 1-12 arasıdır, monthIndex 0-11
      const hijriMonth = monthIndex + 1;
      const daysInMonth = getHijriMonthLength(year, hijriMonth);

      return (
        <View
          key={monthName}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: GAP,
          }}
        >
          <View style={{ width: LABEL_WIDTH }}>
            <Text style={{ fontSize: 9, color: textMuted, fontWeight: "600" }}>
              {monthName}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: GAP }}>
            {Array.from({ length: 30 }).map((_, dayIdx) => {
              const day = dayIdx + 1;
              // Hicri Tarih Formatı: YYYY-MM-DD
              const dateStr = `${year}-${hijriMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

              const isValidDay = day <= daysInMonth;
              const isDone =
                completedDates instanceof Set && completedDates.has(dateStr);

              return (
                <View
                  key={`${monthIndex}-${day}`}
                  style={{
                    width: CELL_WIDTH,
                    height: CELL_HEIGHT,
                    borderRadius: 1,
                    backgroundColor: !isValidDay
                      ? "transparent"
                      : isDone
                        ? active
                        : `${cardBorder}40`,
                  }}
                />
              );
            })}
          </View>
        </View>
      );
    });
  }, [completedDates, active, cardBorder, year, textMuted]);

  if (isLoading) return null;

  return (
    <Card style={{ backgroundColor: card, marginTop: 16 }}>
      <CardContent style={{ padding: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: "bold", marginBottom: 12 }}>
          Yıllık Aktivite Döngüsü ({year})
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginLeft: LABEL_WIDTH,
            marginBottom: 4,
          }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <View
              key={i}
              style={{ width: CELL_WIDTH + GAP, alignItems: "center" }}
            >
              {(i + 1) % 5 === 0 ? (
                <Text style={{ fontSize: 7, color: textMuted }}>{i + 1}</Text>
              ) : null}
            </View>
          ))}
        </View>

        <View>{grid}</View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            gap: 12,
            justifyContent: "flex-end",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View
              style={{
                width: 6,
                height: 12,
                backgroundColor: `${cardBorder}40`,
                borderRadius: 1,
              }}
            />
            <Text style={{ fontSize: 10, color: textMuted }}>Boş</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View
              style={{
                width: 6,
                height: 12,
                backgroundColor: active,
                borderRadius: 1,
              }}
            />
            <Text style={{ fontSize: 10, color: textMuted }}>Tamam</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
});
