import { withOpacity } from "@/theme/colors";
import { Spacing } from "@/theme/globals";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useDeedLogic } from "@/hooks/useDeedLogic";
import { DeedActionButton } from "./DeedActionButton";
import { DeedBadge } from "./DeedBadge";
import { DeedInfo } from "./DeedInfo";

export const DeedCard = React.memo(({ item, references }: any) => {
  const router = useRouter();
  const {
    containerStyle,
    status,
    points,
    isButtonActive,
    themeColor,
    isDone,
    isPastDate,
    viewMode,
    green,
  } = useDeedLogic(item, references);

  const handlePress = useCallback(() => {
    if (item?.deedId) router.push(`/deed/${item.deedId}`);
  }, [item?.deedId, router]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        containerStyle,
        isDone && { backgroundColor: withOpacity(green, 0.05) },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <DeedBadge
        viewMode={viewMode}
        points={points}
        level={item.level}
        color={green}
      />

      <DeedInfo
        item={item}
        viewMode={viewMode}
        isPastDate={isPastDate}
        isDone={isDone}
        status={status}
        themeColor={themeColor}
        references={references}
      />

      {/* Sağ Aksiyon Butonu */}
      <View
        style={{
          opacity: isButtonActive && !isPastDate ? 1 : 0.8,
          marginLeft: Spacing.sm,
        }}
      >
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
});
