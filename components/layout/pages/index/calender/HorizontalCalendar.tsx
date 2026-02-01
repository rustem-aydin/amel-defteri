import { useEarliestActivityDate } from "@/db/hooks/useAllQueries";
import { useModeToggle } from "@/hooks/useModeToggle";
import { useAppStore } from "@/store/useAppStore";
import { useColors } from "@/theme/useColors";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Türkçe Gün İsimleri
const TR_DAYS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const FUTURE_DAYS = 30;

// YARDIMCI: YYYY-MM-DD -> Date
const parseDate = (str: string) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// YARDIMCI: Date -> YYYY-MM-DD
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const HorizontalCalendar = () => {
  const { selectedDate, setSelectedDate } = useAppStore();
  const { isDark } = useModeToggle();
  const { background, active, text, textMuted, border } = useColors();

  // FIX: Type hatasını önlemek için 'any' kullanıyoruz
  const listRef = useRef<any>(null);

  // İlk yükleme kontrolü (Animasyon yönetimi için)
  const [hasScrolled, setHasScrolled] = useState(false);

  // Veritabanından en eski tarihi çek
  const { data: earliestDateStr, isLoading } = useEarliestActivityDate();

  const { dates, todayStr } = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    const tStr = formatDate(today);

    // 1. Başlangıç Tarihi
    let startDate = new Date(today);
    if (earliestDateStr) {
      startDate = parseDate(earliestDateStr);
    } else {
      startDate.setDate(today.getDate() - 6);
    }
    startDate.setHours(0, 0, 0, 0);

    if (startDate > today) {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
    }

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + FUTURE_DAYS);

    const list: string[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      list.push(formatDate(current));
      current.setDate(current.getDate() + 1);
    }

    return { dates: list, todayStr: tStr };
  }, [earliestDateStr]);

  // --- SCROLL KONUMLANMA MANTIĞI (DÜZELTİLDİ) ---
  useEffect(() => {
    // Liste boşsa veya ref hazır değilse işlem yapma
    if (dates.length === 0 || !listRef.current) return;

    let targetIndex = dates.indexOf(selectedDate);

    // Eğer seçili tarih listede yoksa bugüne git
    if (targetIndex === -1) {
      targetIndex = dates.indexOf(todayStr);
    }
    // O da yoksa listenin sonuna git
    if (targetIndex === -1) {
      targetIndex = dates.length - 1;
    }

    if (targetIndex !== -1) {
      // hasScrolled FALSE ise (ilk açılış) -> animated: false
      // hasScrolled TRUE ise (sonraki tıklamalar) -> animated: true
      listRef.current.scrollToIndex({
        index: targetIndex,
        animated: hasScrolled,
        viewPosition: 0.5, // Öğeyi ortala
      });

      // İlk kaydırmadan sonra durumu güncelle
      if (!hasScrolled) {
        setHasScrolled(true);
      }
    }
  }, [dates, selectedDate, hasScrolled, todayStr]);

  const renderItem = ({ item }: { item: string }) => {
    const dateObj = parseDate(item);
    const dayName = TR_DAYS[dateObj.getDay()];
    const dayNum = dateObj.getDate();

    const isSelected = item === selectedDate;
    const isToday = item === todayStr;

    let bg = "transparent";
    let brd = border;
    let txtName = textMuted;
    let txtNum = text;
    let brdWidth = 1;

    if (isSelected) {
      bg = active;
      brd = active;
      txtName = "#FFF";
      txtNum = "#FFF";
    } else if (isToday) {
      bg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
      brd = active;
      brdWidth = 1.5;
      txtName = active;
      txtNum = active;
    }

    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(item)}
        activeOpacity={0.7}
        style={[
          styles.item,
          {
            backgroundColor: bg,
            borderColor: brd,
            borderWidth: brdWidth,
          },
        ]}
      >
        <Text style={[styles.dayName, { color: txtName }]}>{dayName}</Text>
        <Text style={[styles.dayNum, { color: txtNum }]}>{dayNum}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading && dates.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: background, borderColor: border },
        ]}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <FlashList
        ref={listRef}
        data={dates}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 85,
    width: "100%",
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  item: {
    width: 50,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginRight: 10,
  },
  dayName: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "capitalize",
  },
  dayNum: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
