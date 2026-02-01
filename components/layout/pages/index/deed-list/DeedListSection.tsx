import { useCalendarPreload, useDailyPlan } from "@/db/hooks/useAllQueries";
import { useModeToggle } from "@/hooks/useModeToggle";
import { useTimeEngine } from "@/hooks/useTimeEngine";
import { useAppStore } from "@/store/useAppStore";
import { useLocationStore } from "@/store/useLocationStore";
import { Colors } from "@/theme/colors";
import { Spacing, Typography } from "@/theme/globals";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { DeedItemsList } from "./components/DeedList";

interface DeedListSectionProps {
  ListHeaderComponent?: React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const DeedListSection = ({
  ListHeaderComponent,
}: DeedListSectionProps) => {
  const router = useRouter();
  const { isDark } = useModeToggle();
  const activeColors = isDark ? Colors.dark : Colors.light;

  const [loading, setLoading] = useState(false);

  const selectedDate = useAppStore((s) => s.selectedDate);
  const { data: allDeeds = [] } = useDailyPlan(selectedDate);

  const { coords, fetchLocation } = useLocationStore();
  const references = useTimeEngine(coords);

  useCalendarPreload(selectedDate);

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      await fetchLocation();
      router.push("/library");
    } catch (error) {
      console.error("Konum alınırken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!coords) {
    return (
      <View style={styles.emptyContainer}>
        {ListHeaderComponent}
        <View style={styles.buttonWrapper}>
          <Text style={[styles.infoText, { color: activeColors.textMuted }]}>
            Vakitlerin hesaplanabilmesi için konumunuz gereklidir.
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: activeColors.active }]}
            onPress={handleGetLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Konum Al ve Devam Et</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Koordinat varsa normal listeyi göster
  return (
    <DeedItemsList
      data={allDeeds}
      references={references}
      selectedDate={selectedDate}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xxl,
  },
  infoText: {
    fontSize: Typography.body,
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: Typography.h3,
    fontWeight: "bold",
  },
});
