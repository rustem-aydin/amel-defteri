import { useEarliestActivityDate } from "@/db/hooks/useAllQueries";
import { useModeToggle } from "@/hooks/useModeToggle";
import { useAppStore } from "@/store/useAppStore";
import { useColors } from "@/theme/useColors";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  addHijriDays,
  compareHijriDates,
  parseHijriDate,
} from "@/helpers/hijriUtils";
import { useTimeReferences } from "@/context/TimeEngineContext";

const FUTURE_DAYS = 30;
const DEFAULT_PAST_DAYS = 3;

export const HorizontalCalendar = () => {
  const { selectedHijriDate, setSelectedHijriDate } = useAppStore();
  const engine = useTimeReferences();
  const { isDark } = useModeToggle();
  const { background, active, text, textMuted, border } = useColors();
  const { data: earliestDate } = useEarliestActivityDate();

  const listRef = useRef<any>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Use engine.effectiveDateHijri if available (this correctly handles post-maghrib logic)
  const effectiveHijriToday = engine?.effectiveDateHijri || useAppStore.getState().effectiveHijriToday;

  const { dates, todayHijri } = useMemo(() => {
    const today = effectiveHijriToday;

    // 1. Başlangıç Tarihi: En eski aktivite tarihi veya bugünden 3 gün gerisi
    const fallbackStart = addHijriDays(today, -DEFAULT_PAST_DAYS);
    let startHijri = fallbackStart;

    if (earliestDate && compareHijriDates(earliestDate, fallbackStart) < 0) {
      startHijri = earliestDate;
    }

    // 2. Bitiş Tarihi: 30 gün ilerisi
    const endHijri = addHijriDays(today, FUTURE_DAYS);

    // 3. Tüm Hicri günleri oluştur
    const list: string[] = [];
    let current = startHijri;

    while (compareHijriDates(current, endHijri) <= 0) {
      list.push(current);
      current = addHijriDays(current, 1);
    }

    return { dates: list, todayHijri: today };
  }, [earliestDate, effectiveHijriToday]);

  // --- SCROLL KONUMLANMA ---
  useEffect(() => {
    if (dates.length === 0 || !listRef.current) return;

    let targetIndex = dates.indexOf(selectedHijriDate);

    // Seçili tarih yoksa bugüne git
    if (targetIndex === -1) {
      targetIndex = dates.indexOf(todayHijri);
    }
    if (targetIndex === -1) {
      targetIndex = dates.length - 1;
    }

    if (targetIndex !== -1) {
      listRef.current.scrollToIndex({
        index: targetIndex,
        animated: hasScrolled,
        viewPosition: 0.5,
      });

      if (!hasScrolled) {
        setHasScrolled(true);
      }
    }
  }, [dates, selectedHijriDate, hasScrolled, todayHijri]);

  const renderItem = ({ item }: { item: string }) => {
    const { day, monthName } = parseHijriDate(item);

    const isSelected = item === selectedHijriDate;
    const isToday = item === todayHijri;

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
        onPress={() => setSelectedHijriDate(item)}
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
        <Text style={[styles.dayName, { color: txtName }]}>
          {monthName.slice(0, 3)}
        </Text>
        <Text style={[styles.dayNum, { color: txtNum }]}>{day}</Text>
      </TouchableOpacity>
    );
  };

  if (dates.length === 0) {
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
        estimatedItemSize={60}
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
