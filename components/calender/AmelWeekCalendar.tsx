import { useModeToggle } from "@/hooks/useModeToggle";
import { useColors } from "@/theme/useColors";
import React, { useMemo } from "react";
import { View } from "react-native";
import { Calendar, LocaleConfig, WeekCalendar } from "react-native-calendars";

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
  isWeekView?: boolean;
  [key: string]: any;
}

export const AmelCalendar = ({
  selectedDate,
  onDateChanged,
  isWeekView = true,
  ...props
}: AmelCalendarProps) => {
  const { isDark, mode } = useModeToggle();
  const { background, active, text, textMuted, border } = useColors();

  const theme = useMemo(
    () => ({
      backgroundColor: background,
      calendarBackground: background, // Günlerin arkasındaki renk

      // 2. YAZI RENKLERİ (Kritik)
      dayTextColor: text, // Gün sayıları (1, 2, 3...) -> Siyah/Beyaz
      monthTextColor: text, // Ay ismi (Ocak 2024) -> Siyah/Beyaz
      textSectionTitleColor: textMuted, // Gün isimleri (Pzt, Sal...) -> Gri

      // 3. SEÇİLİ GÜN AYARLARI
      selectedDayBackgroundColor: active, // Seçilen günün yuvarlağı
      selectedDayTextColor: isDark ? "#000000" : "#FFFFFF", // Seçilen günün içindeki yazı (Kontrast için)

      // 4. BUGÜN AYARLARI
      todayTextColor: active, // Bugünün yazısı renkli olsun
      todayBackgroundColor: isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.05)",

      // 5. DİĞER DETAYLAR
      textDisabledColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", // Pasif günler
      dotColor: active,
      arrowColor: active,

      // Font Ayarları
      textDayFontWeight: "600" as const,
      textMonthFontWeight: "bold" as const,
      textDayHeaderFontWeight: "600" as const,

      ...props.theme,
    }),
    [mode, background, active, text, textMuted, border, props.theme],
  );

  const CalendarComponent = isWeekView ? WeekCalendar : Calendar;

  return (
    <View
      key={mode} // Mode değişince (Light/Dark) burayı sıfırlar
      style={{
        backgroundColor: background,
        width: "100%",
        // Border ekleyerek takvimi netleştirelim (İsteğe bağlı)
        borderBottomWidth: isWeekView ? 1 : 0,
        borderColor: border,
      }}
    >
      <CalendarComponent
        firstDay={1}
        enableSwipeMonths={true}
        // Zorunlu Propslar
        current={selectedDate}
        onDayPress={(day: any) => onDateChanged(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, disableTouchEvent: true },
        }}
        // Tema ve Stil
        theme={theme}
        style={{
          backgroundColor: background, // Bileşenin kendisine de renk veriyoruz
          height: isWeekView ? "auto" : 350,
        }}
        {...props}
      />
    </View>
  );
};
