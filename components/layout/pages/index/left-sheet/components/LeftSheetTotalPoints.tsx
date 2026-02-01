import { Text } from "@/components/ui/text";
import { useCalculateTotalPoints } from "@/db/hooks/useAllQueries";
import { useColors } from "@/theme/useColors";
import React from "react";
import { StyleSheet, View } from "react-native";
import AnimatedRollingNumber from "react-native-animated-rolling-numbers";
import { Easing } from "react-native-reanimated";

const LeftSheetTotalPoints = () => {
  const { card } = useColors();
  const { data } = useCalculateTotalPoints();

  return (
    <View style={styles.menuItemLeft}>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: card,
          },
        ]}
      >
        <Text style={styles.menuText}>Paun</Text>
      </View>
      <AnimatedRollingNumber
        value={Number(data)}
        useGrouping
        toFixed={0}
        showMinusSign
        textStyle={styles.digits}
        spinningAnimationConfig={{ duration: 500, easing: Easing.bounce }}
      />
    </View>
  );
};

export default LeftSheetTotalPoints;

const styles = StyleSheet.create({
  menuItemLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  digits: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
});
