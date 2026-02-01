import { useModeToggle } from "@/hooks/useModeToggle";
import { useColors } from "@/theme/useColors";
import React, { useMemo } from "react";
import { View } from "react-native";
import { LocaleConfig, WeekCalendar } from "react-native-calendars";

// --- TÜRKÇE DİL AYARLARI ---
LocaleConfig.locales["tr"] = {
  monthNames: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
  monthNamesShort: [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ],
  dayNames: [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ],
  dayNamesShort: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
  today: "Bugün",
};
LocaleConfig.defaultLocale = "tr";

interface AmelCalendarProps {
  selectedDate: string;
  onDateChanged: (date: string) => void;
  [key: string]: any;
}

export const AmelCalendar = ({
  selectedDate,
  onDateChanged,
  ...props
}: AmelCalendarProps) => {
  const { isDark } = useModeToggle();
  const { background, active, text, textMuted, border } = useColors();

  const theme = useMemo(
    () => ({
      backgroundColor: background,
      calendarBackground: background,
      dayTextColor: text,
      monthTextColor: text,
      textSectionTitleColor: textMuted,
      selectedDayBackgroundColor: active,
      selectedDayTextColor: isDark ? "#000000" : "#FFFFFF",
      todayTextColor: active,
      todayBackgroundColor: isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.05)",
      textDisabledColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
      dotColor: active,
      arrowColor: active,
      textDayFontWeight: "600" as const,
      textMonthFontWeight: "bold" as const,
      textDayHeaderFontWeight: "600" as const,
      ...props.theme,
    }),
    [isDark, background, active, text, textMuted, props.theme],
  );

  const markedDates = useMemo(
    () => ({
      [selectedDate]: { selected: true, disableTouchEvent: true },
    }),
    [selectedDate],
  );

  return (
    <View
      collapsable={false}
      style={{
        backgroundColor: background,
        width: "100%",
        borderBottomWidth: 1,
        borderColor: border,
      }}
    >
      <WeekCalendar
        firstDay={1}
        enableSwipeMonths={true}
        current={selectedDate}
        onDayPress={(day: any) => onDateChanged(day.dateString)}
        markedDates={markedDates}
        theme={theme}
        style={{
          backgroundColor: background,
        }}
        {...props}
      />
    </View>
  );
};
