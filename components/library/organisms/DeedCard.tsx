import { useRouter } from "expo-router";
// DEĞİŞİKLİK 1: Check yerine Minus import edildi
import { Minus, Plus, Sun } from "lucide-react-native";
import { MotiView } from "moti";
import React, { memo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SvgUri } from "react-native-svg";

// UI Bileşenleri
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { TimerDisplay } from "../molecules/TimerDisplay";

import { useToggleDeed } from "@/db/hooks/useAllMutations"; // Hook yolunuza dikkat edin
import { Shadow, Spacing, Typography } from "@/theme/globals";
import { useColors } from "@/theme/useColors";

export const DeedCard = memo(
  ({ item, index, isLiveMode, references }: any) => {
    const router = useRouter();
    const { mutate: toggleAmel, isPending } = useToggleDeed();
    const { success } = useToast();
    const [isToggling, setIsToggling] = useState(false);
    const {
      card,
      green,
      cardBorder,
      text,
      textMuted,
      primary,
      primaryForeground,
      destructive,
    } = useColors();

    const isAdded = !!item?.isAdded;
    const handleToggle = () => {
      if (!item?.id || isPending || isToggling) return;
      setIsToggling(true);

      toggleAmel(
        { deedId: item.id, isAdded: isAdded },
        {
          onSuccess: () => {
            success(isAdded ? "Çıkarıldı" : "Eklendi", "Liste güncellendi.");
            setIsToggling(false);
          },
          onError: () => setIsToggling(false),
        },
      );
    };

    const endTime = item.endRef ? references[item.endRef] : null;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 300, delay: index * 20 }}
        style={styles.container}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/deed/[id]", params: { id: item.id } })
          }
          activeOpacity={0.7}
        >
          <Card
            style={StyleSheet.flatten([
              styles.card,
              {
                backgroundColor: card,
                borderColor: `${item.status?.colorCode}50`,
              },
            ])}
          >
            <CardContent style={styles.content}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: item.status?.colorCode
                      ? item.status?.colorCode + "15"
                      : cardBorder,
                  },
                ]}
              >
                {item.category?.iconUrl ? (
                  <SvgUri uri={item.category?.iconUrl} width={22} height={22} />
                ) : (
                  <Sun size={20} color={item?.status?.colorCode || text} />
                )}
              </View>

              {/* Metin Bölümü */}
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: text }]}>
                  {item.title}
                </Text>

                {isLiveMode && endTime ? (
                  <TimerDisplay endTime={endTime} />
                ) : (
                  <Text
                    numberOfLines={1}
                    style={[styles.description, { color: textMuted }]}
                  >
                    {item.description}
                  </Text>
                )}
              </View>

              {/* DEĞİŞİKLİK 3: Ekle/Çıkar Butonu Mantığı */}
              <TouchableOpacity
                onPress={handleToggle}
                disabled={isToggling || isPending}
                style={[
                  styles.addBtn,
                  {
                    backgroundColor: isAdded
                      ? `${destructive}40`
                      : `${green}40`,
                    // Border ekleyerek ayrışmasını sağlayabiliriz (isteğe bağlı)
                  },
                  (isToggling || isPending) && { opacity: 0.5 },
                ]}
              >
                {isAdded ? (
                  // Ekliyse MINUS (Eksi) ikonu ve Kırmızı renk
                  <Minus size={20} color={destructive} />
                ) : (
                  // Ekli değilse PLUS (Artı) ikonu ve Beyaz renk
                  <Plus size={20} color={primaryForeground} />
                )}
              </TouchableOpacity>
            </CardContent>
          </Card>
        </TouchableOpacity>
      </MotiView>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.isAdded === nextProps.item.isAdded &&
      prevProps.isLiveMode === nextProps.isLiveMode &&
      prevProps.item.title === nextProps.item.title
    );
  },
);

DeedCard.displayName = "DeedCard";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    ...Shadow.light,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm + 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.sm + 4,
  },
  title: {
    fontWeight: "700",
    fontSize: Typography.body,
  },
  description: {
    fontSize: Typography.caption,
    marginTop: 2,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
