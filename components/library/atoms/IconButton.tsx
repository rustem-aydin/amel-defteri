import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { TouchableOpacity } from "react-native";

export const IconButton = memo(
  ({ name, size = 24, color = "white", onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  )
);
