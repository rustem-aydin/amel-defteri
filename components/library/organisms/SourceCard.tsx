import { Text } from "@/components/ui/text";
import { Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";
import { BookOpen, Lightbulb, Quote } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SectionHeader } from "../atoms/SectionHeader";

export const SourceCard = ({ type, text, refInfo, color }: any) => {
  const cardBg = useColor("card");
  const textColor = useColor("text");
  const textMuted = useColor("textMuted");

  const isAyet = type === "AYET";
  const isHadis = type === "HADIS";
  const borderColor = isAyet ? "#c1121f" : isHadis ? "#12aa12" : "#ffbd00";
  const Icon = isAyet ? BookOpen : isHadis ? Quote : Lightbulb;

  return (
    <View style={styles.container}>
      <SectionHeader>
        {isAyet ? "AYET-İ KERİME" : isHadis ? "HADİS-İ ŞERİF" : "KAYNAK"}
      </SectionHeader>
      <View
        style={[
          styles.card,
          { backgroundColor: cardBg, borderLeftColor: borderColor },
        ]}
      >
        <Icon size={80} color={color} opacity={0.05} style={styles.watermark} />
        <Text style={[styles.text, { color: textColor }]}>"{text}"</Text>
        <View style={styles.footer}>
          {isHadis && (
            <View style={styles.sahih}>
              <Text style={styles.sahihText}>Sahih</Text>
            </View>
          )}
          <Text style={[styles.ref, { color: textMuted }]}>{refInfo}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: Spacing.lg },
  card: {
    borderRadius: 16,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    position: "relative",
    overflow: "hidden",
  },
  watermark: { position: "absolute", right: -10, bottom: -10 },
  text: { fontSize: 17, fontStyle: "italic", lineHeight: 26 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  ref: { fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  sahih: {
    backgroundColor: "rgba(74, 222, 128, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sahihText: { color: "#4ADE80", fontSize: 10, fontWeight: "800" },
});
