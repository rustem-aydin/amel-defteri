import { useAppStore, ViewMode } from "@/store/useAppStore";
import { useColors } from "@/theme/useColors";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const DeedCardModes = () => {
  const { iconBg, active, text } = useColors();
  const viewMode = useAppStore((s) => s.viewMode);

  const modeConfig = useMemo(() => {
    switch (viewMode) {
      case "time":
        return {
          icon: "time-outline",
          color: text,
          bg: iconBg,
          label: "Süre",
        };
      case "level":
        return {
          icon: "trophy-outline",
          color: text,
          bg: iconBg,
          label: "Level",
        };
      default:
        return {
          icon: "information-circle-outline",
          color: text,
          bg: iconBg,
          label: "Bilgi",
        };
    }
  }, [viewMode, active, text, iconBg]);
  const setViewMode = useAppStore((s) => s.setViewMode);

  const handleToggleMode = useCallback(() => {
    let nextMode: ViewMode = "info";

    if (viewMode === "info") nextMode = "time";
    else if (viewMode === "time") nextMode = "level";
    else nextMode = "info";

    setViewMode(nextMode);
  }, [viewMode, setViewMode]);
  return (
    <TouchableOpacity
      onPress={handleToggleMode}
      style={[
        styles.actionBtn,
        {
          backgroundColor: modeConfig.bg,
          borderWidth: 1,
        },
      ]}
    >
      <Ionicons
        // @ts-ignore
        name={modeConfig.icon}
        size={20}
        color={modeConfig.color}
      />
    </TouchableOpacity>
  );
};

export default DeedCardModes;
const styles = StyleSheet.create({
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
