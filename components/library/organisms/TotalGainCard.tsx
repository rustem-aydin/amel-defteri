import { Text } from "@/components/ui/text"; // Kendi Text bileşenini kullanıyoruz
import { Trophy } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ProgressBar } from "../atoms/ProgressBar";
import { SectionHeader } from "../atoms/SectionHeader";

// Tema ve Sabitler
import { Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";

export const TotalGainCard = ({ totalPoints, rank, color }: any) => {
  // Tema Renkleri
  const cardBg = useColor("card");
  const textColor = useColor("text");
  const textMuted = useColor("textMuted");
  const iconBg = useColor("iconBg");
  const orange = useColor("orange"); // Kupa rengi için veya alternatif olarak 'color' kullanılabilir

  return (
    <View style={styles.container}>
      <SectionHeader>TOPLAM KAZANÇ</SectionHeader>

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.row}>
          {/* Trophy Kutusu - Temaya Duyarlı */}
          <View
            style={[
              styles.trophyBox,
              { backgroundColor: iconBg, borderColor: orange + "30" },
            ]}
          >
            <Trophy size={28} color={orange} />
          </View>

          {/* Orta Bölüm: Puan Bilgisi */}
          <View style={styles.scoreInfo}>
            <Text style={[styles.label, { color: textMuted }]}>
              BİRİKMİŞ AMEL PUANI
            </Text>
            <View style={styles.scoreRow}>
              <Text style={[styles.score, { color: textColor }]}>
                {totalPoints}
              </Text>
              <Text style={[styles.unit, { color }]}>PUAN</Text>
            </View>
          </View>

          {/* Sağ Bölüm: Kıdem */}
          <View style={styles.rankSection}>
            <Text style={[styles.label, { color: textMuted }]}>KIDEM</Text>
            <Text style={[styles.rank, { color }]}>{rank}</Text>
          </View>
        </View>

        {/* Progress Bölümü */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.label, { color: textMuted }]}>
              SONRAKİ KADEME
            </Text>
            <Text style={[styles.remaining, { color: textColor }]}>
              250 Puan Kaldı
            </Text>
          </View>
          <ProgressBar progress={70} color={color} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  card: {
    borderRadius: 24,
    padding: Spacing.lg,
    // Hafif bir border eklenebilir (isteğe bağlı)
    borderWidth: 1,
    borderColor: "rgba(128,128,128,0.1)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  trophyBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  scoreInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  score: {
    fontSize: 24,
    fontWeight: "900",
  },
  unit: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
    textTransform: "uppercase",
  },
  rankSection: {
    alignItems: "flex-end",
  },
  rank: {
    fontSize: 16,
    fontWeight: "800",
  },
  progressSection: {
    marginTop: Spacing.md + 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  remaining: {
    fontSize: 11,
    fontWeight: "bold",
  },
});
