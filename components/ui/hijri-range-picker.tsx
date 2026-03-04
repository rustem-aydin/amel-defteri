import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColor } from "@/theme/useColor";
import {
  HIJRI_MONTHS,
  getCurrentHijriDate,
  parseHijriDate,
  getHijriMonthLength,
} from "@/helpers/hijriUtils";
import { CalendarRange, ChevronDown } from "lucide-react-native";
import { useState, useMemo } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { BottomSheet, useBottomSheet } from "./bottom-sheet";

export interface HijriRange {
  startHijri: string;
  endHijri: string;
}

interface HijriRangePickerProps {
  label?: string;
  value: HijriRange;
  onChange: (range: HijriRange) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

const getHijriYears = () => {
  const { year } = parseHijriDate(getCurrentHijriDate());
  return Array.from({ length: 11 }, (_, i) => year - 5 + i);
};

export function HijriRangePicker({
  label,
  value,
  onChange,
}: HijriRangePickerProps) {
  const { isVisible, open, close } = useBottomSheet();

  const primaryColor = useColor("primary");
  const primaryForegroundColor = useColor("primaryForeground");
  const mutedColor = useColor("muted");
  const textMutedColor = useColor("textMuted");
  const textColor = useColor("text");
  const cardColor = useColor("card");

  const startParsed = parseHijriDate(value.startHijri);
  const endParsed = parseHijriDate(value.endHijri);

  const [startMonth, setStartMonth] = useState(startParsed.month);
  const [startYear, setStartYear] = useState(startParsed.year);
  const [endMonth, setEndMonth] = useState(endParsed.month);
  const [endYear, setEndYear] = useState(endParsed.year);
  const [picking, setPicking] = useState<
    "startMonth" | "startYear" | "endMonth" | "endYear" | null
  >(null);

  const hijriYears = useMemo(() => getHijriYears(), []);

  const formatDisplay = () => {
    return `${startParsed.monthName} ${startParsed.year} - ${endParsed.monthName} ${endParsed.year}`;
  };

  const handleConfirm = () => {
    const endDay = getHijriMonthLength(endYear, endMonth);
    onChange({
      startHijri: `${startYear}-${pad(startMonth)}-01`,
      endHijri: `${endYear}-${pad(endMonth)}-${pad(endDay)}`,
    });
    close();
    setPicking(null);
  };

  const renderPicker = () => {
    if (picking === "startMonth" || picking === "endMonth") {
      const currentMonth = picking === "startMonth" ? startMonth : endMonth;
      const setMonth = picking === "startMonth" ? setStartMonth : setEndMonth;

      return (
        <View style={{ height: 300 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {HIJRI_MONTHS.map((month, index) => {
              const isSelected = index + 1 === currentMonth;
              return (
                <TouchableOpacity
                  key={month}
                  onPress={() => {
                    setMonth(index + 1);
                    setPicking(null);
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderRadius: 999,
                    backgroundColor: isSelected
                      ? primaryColor
                      : "transparent",
                    marginVertical: 2,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? primaryForegroundColor : textColor,
                      fontWeight: isSelected ? "600" : "400",
                      fontSize: 17,
                    }}
                  >
                    {month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    }

    if (picking === "startYear" || picking === "endYear") {
      const currentYear = picking === "startYear" ? startYear : endYear;
      const setYear = picking === "startYear" ? setStartYear : setEndYear;

      return (
        <View style={{ height: 300 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {hijriYears.map((year) => {
              const isSelected = year === currentYear;
              return (
                <TouchableOpacity
                  key={year}
                  onPress={() => {
                    setYear(year);
                    setPicking(null);
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderRadius: 999,
                    backgroundColor: isSelected
                      ? primaryColor
                      : "transparent",
                    marginVertical: 2,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? primaryForegroundColor : textColor,
                      fontWeight: isSelected ? "600" : "400",
                      fontSize: 17,
                    }}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    }

    // Ana görünüm: Başlangıç ve Bitiş seçicileri
    return (
      <View style={{ gap: 24 }}>
        <View style={{ gap: 8 }}>
          <Text variant="caption">Başlangıç</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => setPicking("startMonth")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 14,
                borderRadius: 999,
                backgroundColor: mutedColor,
              }}
            >
              <Text variant="subtitle" style={{ marginRight: 4 }}>
                {HIJRI_MONTHS[startMonth - 1]}
              </Text>
              <ChevronDown size={16} color={textColor} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPicking("startYear")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 14,
                borderRadius: 999,
                backgroundColor: mutedColor,
              }}
            >
              <Text variant="subtitle" style={{ marginRight: 4 }}>
                {startYear}
              </Text>
              <ChevronDown size={16} color={textColor} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="caption">Bitiş</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => setPicking("endMonth")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 14,
                borderRadius: 999,
                backgroundColor: mutedColor,
              }}
            >
              <Text variant="subtitle" style={{ marginRight: 4 }}>
                {HIJRI_MONTHS[endMonth - 1]}
              </Text>
              <ChevronDown size={16} color={textColor} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPicking("endYear")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 14,
                borderRadius: 999,
                backgroundColor: mutedColor,
              }}
            >
              <Text variant="subtitle" style={{ marginRight: 4 }}>
                {endYear}
              </Text>
              <ChevronDown size={16} color={textColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={open}
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: cardColor,
          borderRadius: 999,
          backgroundColor: cardColor,
          minHeight: 48,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <View
            style={{
              width: 120,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CalendarRange
              size={20}
              color={textMutedColor}
              strokeWidth={1}
            />
            {label && (
              <View style={{ flex: 1 }}>
                <Text
                  variant="caption"
                  numberOfLines={1}
                  style={{ color: textMutedColor }}
                >
                  {label}
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{ color: textColor, fontSize: 17 }}
            >
              {formatDisplay()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <BottomSheet
        isVisible={isVisible}
        onClose={() => {
          close();
          setPicking(null);
        }}
        title={
          picking
            ? picking.includes("Month")
              ? "Ay Seçin"
              : "Yıl Seçin"
            : "Hicri Tarih Aralığı"
        }
        snapPoints={[0.6]}
      >
        <View style={{ flex: 1 }}>
          {renderPicker()}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 20,
              gap: 12,
            }}
          >
            <Button
              variant="outline"
              onPress={() => {
                if (picking) {
                  setPicking(null);
                } else {
                  close();
                }
              }}
            >
              {picking ? "Geri" : "İptal"}
            </Button>

            {!picking && (
              <Button onPress={handleConfirm} style={{ flex: 1 }}>
                Tamam
              </Button>
            )}
          </View>
        </View>
      </BottomSheet>
    </>
  );
}
