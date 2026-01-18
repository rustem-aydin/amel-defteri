import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  statuses: any[];
  selected: string | null;
  onSelect: (val: string | null) => void;
  counts?: Record<number, number>;
  hideCount?: boolean;
}

export const StatusFilterList = ({
  statuses,
  selected,
  onSelect,
  counts,
  hideCount,
}: Props) => {
  const primary = useColor("active");
  const primaryForeground = useColor("primaryForeground");
  const textMuted = useColor("textMuted");
  const cardBg = useColor("card");
  const borderColor = useColor("border");

  const renderStatusBadge = (
    ad: string | null,
    id: number | null,
    label: string,
  ) => {
    const isActive = selected === ad;

    return (
      <TouchableOpacity key={ad || "null"} onPress={() => onSelect(ad)}>
        <Badge
          variant={isActive ? "success" : "outline"}
          style={StyleSheet.flatten([
            styles.badge,
            {
              backgroundColor: isActive ? primary : cardBg,
              borderColor: isActive ? primary : borderColor,
            },
          ])}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isActive ? primaryForeground : textMuted },
            ]}
          >
            {label}
          </Text>
        </Badge>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: textMuted }]}>Amel Durumu</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {renderStatusBadge(null, null, "Tümü")}
        {statuses.map((s) => renderStatusBadge(s.name, s.id, s.name))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label: {
    marginLeft: Spacing.lg,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  scroll: { paddingLeft: Spacing.lg },
  scrollContent: { paddingRight: 40 },
  badge: {
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: { fontWeight: "bold", fontSize: 12 },
});
