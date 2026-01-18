import { useLocalSearchParams, useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Switch, View } from "react-native";

// --- BİLEŞENLER ---
import { DeedDetailTemplate } from "@/components/library/organisms/DeedDetailTemplate";
import { DeedHeader } from "@/components/library/organisms/DeedHeader";
import { ScoreCard } from "@/components/library/organisms/ScoreCard";
import { SourceCard } from "@/components/library/organisms/SourceCard";
import { StreakCard } from "@/components/library/organisms/StreakCard";
import { TotalGainCard } from "@/components/library/organisms/TotalGainCard";
import { Text } from "@/components/ui/text";

// --- HOOKLAR & TEMA ---
// Not: Bu hookları önceki adımda ayırmıştık
import { useDeed, useDeedStatus } from "@/db/hooks/useAllQueries";

import { useModeToggle } from "@/hooks/useModeToggle";
import { Spacing } from "@/theme/globals";
import { useColors } from "@/theme/useColors";

export default function DeedDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useModeToggle();

  const deedId = id ? Number(id) : 0;

  const { background, card, textMuted, iconBg, active } = useColors();

  const { data: deed, isLoading: isDeedLoading } = useDeed(deedId);

  const { data: isAdded = false } = useDeedStatus(deedId);

  const [reminder, setReminder] = useState(true);

  const streakData = useMemo(
    () => Array.from({ length: 21 }, (_, i) => (i < 7 ? 1 : 0)),
    [],
  );
  const currentLevel = 1;

  if (isDeedLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={active} />
      </View>
    );
  }

  if (!deed) return null;

  const THEME_COLOR = deed.colorCode || active;

  return (
    <DeedDetailTemplate
      header={
        <DeedHeader
          title={deed.title}
          status={deed.statusName || "Genel"}
          // isAdded durumu ayrı hooktan geliyor
          isAdded={isAdded}
          color={THEME_COLOR}
          onBack={() => router.back()}
        />
      }
    >
      {/* Puan Kartı */}
      <ScoreCard
        total={
          ((deed.deedPoints || 0) + (deed.intentionPoints || 0)) * currentLevel
        }
        niyet={deed.intentionPoints || 0}
        amel={(deed.deedPoints || 0) * currentLevel}
        color={THEME_COLOR}
      />

      {/* Kaynaklar (Ayet/Hadis) */}
      {/* useDeed hook'u resources array'ini statik olarak getirir */}
      {deed.resources?.map((res, index) => (
        <SourceCard
          key={`res-${res.id || index}`}
          type={res.type} // "AYET" veya "HADIS"
          text={res.content} // Metin
          refInfo={res.sourceInfo} // Kaynakça
          color={THEME_COLOR}
        />
      ))}

      {/* İstatistik Kartları */}
      <StreakCard
        level={currentLevel}
        multiplier={currentLevel}
        streakData={streakData}
        color={THEME_COLOR}
      />

      <TotalGainCard totalPoints={1250} rank="Sıddık" color={THEME_COLOR} />

      {/* Hatırlatıcı Ayarı */}
      <View
        style={[
          styles.reminderCard,
          { backgroundColor: card, marginTop: Spacing.lg },
        ]}
      >
        <View style={[styles.reminderIcon, { backgroundColor: iconBg }]}>
          <Bell size={24} color={active} />
        </View>
        <View style={{ flex: 1, marginLeft: Spacing.md }}>
          <Text style={styles.reminderTitle}>Hatırlatıcı Kur</Text>
          <Text style={[styles.reminderSub, { color: textMuted }]}>
            Vakit geldiğinde bildirim al
          </Text>
        </View>
        <Switch
          value={reminder}
          onValueChange={setReminder}
          trackColor={{ true: THEME_COLOR, false: isDark ? "#333" : "#ccc" }}
        />
      </View>
    </DeedDetailTemplate>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reminderCard: {
    borderRadius: 24,
    padding: Spacing.md + 4,
    flexDirection: "row",
    alignItems: "center",
  },
  reminderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  reminderTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  reminderSub: {
    fontSize: 12,
  },
});
