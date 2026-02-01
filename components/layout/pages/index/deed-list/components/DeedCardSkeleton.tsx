import { Skeleton } from "@/components/ui/skeleton";
import { View } from "@/components/ui/view";
import { Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";
import React from "react";
import { StyleSheet } from "react-native";

/**
 * Tek bir DeedCard'ın boyutunu ve yapısını taklit eder.
 */
export const DeedCardSkeleton = () => {
  const cardColor = useColor("card");
  const borderColor = useColor("border"); // Eğer border rengi temanızda varsa

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: borderColor || "transparent",
          backgroundColor: cardColor,
        },
      ]}
    >
      {/* Sol: DeedBadge (Puan/Level alanı) */}
      <Skeleton width={48} height={48} style={{ borderRadius: 14 }} />

      {/* Orta: DeedInfo (Başlık ve Durum) */}
      <View style={{ flex: 1, paddingHorizontal: Spacing.sm, gap: 6 }}>
        {/* Başlık */}
        <Skeleton width="70%" height={18} style={{ borderRadius: 4 }} />
        {/* Alt bilgi / Tarih */}
        <Skeleton width="40%" height={14} style={{ borderRadius: 4 }} />
      </View>

      {/* Sağ: DeedActionButton (Buton alanı) */}
      <View style={{ marginLeft: Spacing.sm }}>
        <Skeleton
          width={40}
          height={40}
          style={{ borderRadius: 20 }} // Yuvarlak buton efekti
        />
      </View>
    </View>
  );
};

/**
 * DeedItemsList'in tamamını (liste yapısını) taklit eder.
 */
export const DeedListSkeleton = () => {
  // Ekranda kaç tane görüneceğini tahmin ederek (örn: 6 adet)
  const items = Array.from({ length: 6 }, (_, i) => i);

  return (
    <View style={styles.listContainer}>
      {/* Header Skeleton (Opsiyonel: Eğer listenin başında büyük bir header varsa) */}
      <View style={{ marginBottom: 16 }}>
        <Skeleton
          width="50%"
          height={24}
          style={{ borderRadius: 8, marginBottom: 8 }}
        />
        <Skeleton width="90%" height={60} style={{ borderRadius: 12 }} />
      </View>

      {/* Liste Elemanları */}
      {items.map((key) => (
        <DeedCardSkeleton key={key} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderRadius: 22,
    borderWidth: 1.5,
    // Orijinal karttaki border opacity efektini simüle etmek için şeffaflık verilebilir
    // ancak skeleton'da genellikle border yerine arka plan rengi tercih edilir.
    borderStyle: "solid",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    // FlashList contentContainerStyle ile uyumlu olması için
  },
});
