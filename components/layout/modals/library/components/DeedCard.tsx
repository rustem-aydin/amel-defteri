import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTimeReferences } from "@/context/TimeEngineContext";
import { useToggleDeed } from "@/db/hooks/useAllMutations";
import { Shadow, Spacing, Typography } from "@/theme/globals";
import { useColors } from "@/theme/useColors";
import { useRouter } from "expo-router";
import { Minus, Plus } from "lucide-react-native";
import React, { memo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const DeedCard = memo(
  ({ item, index, isLiveMode }: any) => {
    const references = useTimeReferences();

    const router = useRouter();
    const { mutate: toggleAmel, isPending } = useToggleDeed();
    const [isToggling, setIsToggling] = useState(false);
    const {
      card,
      green,
      cardBorder,
      text,
      textMuted,
      primaryForeground,
      destructive,
    } = useColors();

    const isAdded = !!item?.isAdded;
    const isNew = !!item?.isNew;

    const handleToggle = () => {
      if (!item?.id || isPending || isToggling) return;
      setIsToggling(true);

      toggleAmel(
        { deedId: item.id, isAdded: isAdded },
        {
          onSuccess: () => {
            setIsToggling(false);
          },
          onError: () => setIsToggling(false),
        },
      );
    };

    let endTime: Date | null = null;

    if (references && item.endRef) {
      const val = references[item.endRef as keyof typeof references];
      if (val instanceof Date) {
        endTime = val;
      }
    }

    return (
      <View style={styles.container}>
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
                <Text style={{ color: item?.status?.colorCode }}>{"PUAN"}</Text>
                <Text
                  style={{
                    color: item?.status?.colorCode,
                    fontSize: Typography.h3,
                    fontWeight: "bold",
                  }}
                >
                  {item?.deedPoints}
                </Text>
              </View>

              <View style={styles.textContainer}>
                <View
                  style={[
                    styles.newBadge,
                    {
                      maxWidth: 50,
                      backgroundColor: item?.status?.colorCode,
                      borderRadius: 5,
                    },
                  ]}
                >
                  <Text style={styles.newBadgeText}>{item?.status?.name}</Text>
                </View>
                <Text style={[styles.title, { color: text }]}>
                  {item.title}
                </Text>

                <Text
                  numberOfLines={1}
                  style={[styles.description, { color: textMuted }]}
                >
                  {item.description}
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleToggle}
                disabled={isToggling || isPending}
                style={[
                  styles.addBtn,
                  {
                    backgroundColor: isAdded
                      ? `${destructive}40`
                      : `${green}40`,
                  },
                  (isToggling || isPending) && { opacity: 0.5 },
                ]}
              >
                {isAdded ? (
                  <Minus size={20} color={destructive} />
                ) : (
                  <Plus size={20} color={primaryForeground} />
                )}
              </TouchableOpacity>
            </CardContent>
          </Card>
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.isAdded === nextProps.item.isAdded &&
      prevProps.item.isNew === nextProps.item.isNew && // isNew değişirse render et
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
    padding: 0,
    margin: 0,
    borderRadius: 18,
    borderWidth: 1,
    ...Shadow.light,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.sm + 4,
    justifyContent: "center",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // Başlık ile badge arası boşluk
    marginBottom: 2,
  },
  title: {
    fontWeight: "700",
    fontSize: Typography.body,
    flexShrink: 1, // Uzun başlıkların badge'i ekrandan itmesini engellemek için
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  newBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: Typography.caption,
    marginTop: 0,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
