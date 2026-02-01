// components/library/atoms/FilterIconBtn.tsx
import { Colors } from "@/theme/colors";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface IconBtnProps {
  onPress: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  activeColor?: string;
}

export const FilterIconBtn = memo(
  ({
    onPress,
    isActive,
    children,
    activeColor = Colors.dark.primary,
  }: IconBtnProps) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.iconBtn,
        isActive && { backgroundColor: activeColor, borderColor: activeColor },
      ]}
    >
      {children}
    </TouchableOpacity>
  ),
);

const styles = StyleSheet.create({
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#0D1A12",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
});
