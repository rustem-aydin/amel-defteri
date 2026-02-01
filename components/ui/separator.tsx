import { View } from "@/components/ui/view";
import { useColors } from "@/theme/useColors";
import React from "react";
import { ViewStyle } from "react-native";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  style?: ViewStyle;
}

export function Separator({
  orientation = "horizontal",
  style,
}: SeparatorProps) {
  const { cardBorder } = useColors();

  return (
    <View
      style={[
        {
          backgroundColor: cardBorder,
          ...(orientation === "horizontal"
            ? { height: 1, width: "100%" }
            : { width: 1, height: "100%" }),
        },
        style,
      ]}
    />
  );
}
