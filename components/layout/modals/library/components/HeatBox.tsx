import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const HeatBox = ({
  active,
  color,
}: {
  active: boolean;
  color: string;
}) => (
  <View
    style={[
      styles.box,
      {
        backgroundColor: active ? color : "rgba(255,255,255,0.05)",
        opacity: active ? 1 : 0.5,
      },
    ]}
  />
);

const styles = StyleSheet.create({
  box: { width: (SCREEN_WIDTH - 80 - 36) / 7, height: 32, borderRadius: 4 },
});
