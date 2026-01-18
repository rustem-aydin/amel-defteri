import { DeedCard } from "@/components/deed/DeedCard";
import { Text } from "@/components/ui/text";
import { useUserDeeds } from "@/db/hooks/useAllQueries";
import { useAppStore } from "@/store/useAppStore";
import { Spacing, Typography } from "@/theme/globals";
import { useColors } from "@/theme/useColors";
import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export const DeedListSection = () => {
  const selectedDate = useAppStore((s) => s.selectedDate);
  const isLiveOnly = useAppStore((s) => s.isLiveOnly);
  const { text, textMuted, active } = useColors();

  // 1. BUGÜNÜN TARİHİNİ AL (YYYY-MM-DD Formatında)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;

  const isFutureDate = selectedDate > todayStr;

  const { data: allDeeds = [], isLoading } = useUserDeeds(selectedDate);

  const deeds = useMemo(() => {
    if (!isLiveOnly) return allDeeds;
    return allDeeds.filter((d) => d.startRef && d.endRef);
  }, [allDeeds, isLiveOnly]);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={active}
        style={{ marginTop: 20 }}
      />
    );
  }

  if (isFutureDate) {
    return (
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.sectionTitle,
            { color: textMuted, fontSize: Typography.body },
          ]}
        >
          Gelecek günler için henüz işlem yapılamaz.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.listHeader}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          {isLiveOnly ? "Vakti Çıkmadan Yetiş!" : "Günlük Ameller"}
        </Text>
      </View>

      {deeds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: textMuted }]}>
            {isLiveOnly
              ? "Şu an aktif amel yok."
              : "Bugün için planlanmış amel yok."}
          </Text>
        </View>
      ) : (
        deeds.map((item: any) => (
          <DeedCard key={`${item.userDeedId}-${selectedDate}`} item={item} />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    marginVertical: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: "bold",
  },
  emptyContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: "center",
    justifyContent: "center", // Ortalamak için
  },
  emptyText: {
    fontSize: Typography.body,
    opacity: 0.6,
  },
});
