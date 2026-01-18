import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  categories: any[];
  selected: string;
  onSelect: (val: string) => void;
}

export const CategoryFilterList = ({
  categories,
  selected,
  onSelect,
}: Props) => {
  const primary = useColor("active");
  const primaryForeground = useColor("primaryForeground");
  const textMuted = useColor("textMuted");
  const cardBg = useColor("card");
  const borderColor = useColor("border");

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: textMuted }]}>Amel Türleri</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        {["Tümü", ...categories.map((c) => c.name)].map((cat) => {
          const isActive = selected === cat;
          return (
            <TouchableOpacity key={cat} onPress={() => onSelect(cat)}>
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
                  {cat}
                </Text>
              </Badge>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.lg },
  scroll: { paddingLeft: Spacing.lg },
  scrollContent: { paddingRight: 40 },
  badge: {
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    marginLeft: Spacing.lg,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  badgeText: { fontWeight: "bold", fontSize: 12 },
});
