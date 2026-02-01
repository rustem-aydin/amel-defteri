import { useCalculateTotalPoints } from "@/db/hooks/useAllQueries";
import { useColors } from "@/theme/useColors";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";
import { Easing } from "react-native-reanimated";

const HeaderAllPoints = () => {
  const router = useRouter();

  const { iconBg } = useColors();
  const { data } = useCalculateTotalPoints();
  const { displayValue, suffix } = useMemo(() => {
    if (Number(data) >= 1000000000) {
      return { displayValue: Number(data) / 1000000000, suffix: "Mr" };
    }
    if (Number(data) >= 1000000) {
      return { displayValue: Number(data) / 1000000, suffix: "Mil" };
    }

    if (Number(data) >= 1000) {
      return { displayValue: Number(data) / 1000, suffix: "Bin" };
    }
    return { displayValue: Number(data), suffix: "" };
  }, [Number(data)]);

  return (
    <Pressable
      onPress={() => router.push("/stats")}
      style={[styles.pointBadge, { backgroundColor: iconBg }]}
    >
      <AnimatedRollingNumber
        value={displayValue}
        toFixed={0}
        showMinusSign
        useGrouping={false}
        textStyle={styles.digits}
        spinningAnimationConfig={{ duration: 500, easing: Easing.bounce }}
      />
      <Text style={styles.suffixText}>{suffix}</Text>
    </Pressable>
  );
};

export default HeaderAllPoints;

const styles = StyleSheet.create({
  pointBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
  },
  digits: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  suffixText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gold",
    marginLeft: 2,
  },
});
