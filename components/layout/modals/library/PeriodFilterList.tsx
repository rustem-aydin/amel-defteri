import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  periods: any[];
  selected: string;
  onSelect: (kod: string) => void;
}

export const PeriodFilterList = ({ periods, selected, onSelect }: Props) => {
  const primary = useColor("active");
  const primaryForeground = useColor("primaryForeground");
  const textMuted = useColor("textMuted");
  const cardBg = useColor("card");
  const borderColor = useColor("border");

  const renderBadge = (kod: string, label: string, showIcon = false) => {
    const isActive = selected === kod;
    return (
      <TouchableOpacity key={kod} onPress={() => onSelect(kod)}>
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
      <Text style={[styles.label, { color: textMuted }]}>Zaman Dilimi</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {renderBadge("Tümü", "Tümü")}
        {periods.map((p) => renderBadge(p.code, p.title, true))}
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
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeText: { fontWeight: "bold", fontSize: 12, marginLeft: 2 },
});
