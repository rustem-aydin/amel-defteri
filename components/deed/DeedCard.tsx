import { Text } from "@/components/ui/text";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { DeedActionButton } from "./DeedActionButton";

import { getAmelStatus, useTimeEngine } from "@/hooks/useTimeEngine";
import { useLocationStore } from "@/store/useLocationStore";
import { withOpacity } from "@/theme/colors";
import { Spacing, Typography } from "@/theme/globals";
import { useColors } from "@/theme/useColors";
import { useRouter } from "expo-router";
import { DeedTime } from "./Deed-time";

export const DeedCard = React.memo(({ item }: any) => {
  const router = useRouter();
  const coords = useLocationStore((s) => s.coords);
  const references = useTimeEngine(coords);
  const themeColor = item?.colorCode || item?.statusColor || "#4F46E5";

  const isDone = !!item?.isCompleted;

  const points = item?.deedPoints || 0;

  const { status } = getAmelStatus(references, item?.startRef, item?.endRef);

  const { card, text, border, green } = useColors();

  const isNotStarted = status === "not_started";
  const isExpired = status === "expired";
  const isActiveTime = status === "active" || status === "all_day";

  const isCardDisabled = false;

  const isButtonActive = !isNotStarted;

  let containerOpacity = 1;
  let containerBorderColor = border;

  if (isNotStarted) {
    containerOpacity = 0.4;
    containerBorderColor = themeColor;
  } else if (isDone) {
    containerBorderColor = green;
  } else if (isActiveTime) {
    containerBorderColor = themeColor;
  } else if (isExpired) {
    containerOpacity = 0.6;
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: card,
          borderColor: containerBorderColor,
          opacity: containerOpacity,
        },
        isDone && { backgroundColor: withOpacity(themeColor, 0.08) },
      ]}
      onPress={() => router.push(`/deed/${item?.deedId}`)}
      activeOpacity={0.7}
      disabled={isCardDisabled}
    >
      <View
        style={[
          styles.levelBadge,
          {
            borderColor: themeColor,
            opacity: isDone ? 1 : 0.6,
            backgroundColor: isDone
              ? withOpacity(themeColor, 0.1)
              : "transparent",
          },
        ]}
      >
        <Text style={[styles.levelLabel, { color: themeColor }]}>LVL</Text>
        <Text style={[styles.levelNumber, { color: themeColor }]}>
          {item.level || 1}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: text }]}>{item?.title}</Text>

        <View style={{ marginTop: 4 }}>
          <DeedTime start_ref={item?.startRef} end_ref={item?.endRef} />
        </View>
      </View>

      <View style={{ opacity: isButtonActive ? 1 : 0.5 }}>
        <DeedActionButton
          deedId={item?.deedId}
          points={points}
          status={status}
          isCompleted={isDone}
          disabled={!isButtonActive}
        />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    marginTop: Spacing.sm,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  levelLabel: {
    fontSize: 8,
    fontWeight: "900",
    marginBottom: -2,
    letterSpacing: 0.5,
  },
  levelNumber: {
    fontSize: Typography.h3,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "center",
  },
  title: {
    fontSize: Typography.body,
    fontWeight: "700",
    marginBottom: 2,
  },
});
