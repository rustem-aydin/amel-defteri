import { withOpacity } from "@/theme/colors";
import { Spacing } from "@/theme/globals";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useDeedLogic } from "@/hooks/useDeedLogic";
import { useColors } from "@/theme/useColors"; // ✅ Eklendi
import { DeedActionButton } from "./DeedActionButton";
import { DeedBadge } from "./DeedBadge";
import { DeedInfo } from "./DeedInfo";

export const DeedCard = React.memo(({ item, engine, displayDate }: any) => {
  const router = useRouter();
  const { card } = useColors(); // ✅ Renkleri al

  const {
    status,
    points,
    isButtonActive,
    themeColor,
    isDone,
    isPastDate,
    isFutureDate, // ✅
    viewMode,
    green,
  } = useDeedLogic(item, engine, displayDate);

  const containerStyle = {
    backgroundColor: card,
    borderColor: isDone ? green : withOpacity(green, 0.3),
    borderWidth: isDone ? 1.5 : 1,
    opacity: 1,
  };

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
        isDone={isDone}
        isFutureDate={isFutureDate} // ✅
      />

      <DeedInfo
        item={item}
        viewMode={viewMode}
        isPastDate={isPastDate}
        isFutureDate={isFutureDate} // ✅
        isDone={isDone}
        status={status}
        themeColor={themeColor}
        engine={engine}
      />

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
          hijriDate={displayDate}
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
