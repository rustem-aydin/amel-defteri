import React from "react";
import { StyleSheet, View } from "react-native";

interface ProgressBarProps {
  progress: number;
  color: string;
}

export const ProgressBar = ({ progress, color }: ProgressBarProps) => (
  <View style={styles.track}>
    <View
      style={[styles.fill, { backgroundColor: color, width: `${progress}%` }]}
    />
  </View>
);

const styles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
