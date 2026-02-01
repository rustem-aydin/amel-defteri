/* components/library/RefreshButton.tsx */
import { Text } from "@/components/ui/text";
import { withOpacity } from "@/theme/colors";
import { useColors } from "@/theme/useColors";
import { RefreshCw } from "lucide-react-native";
import React, { memo } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface RefreshButtonProps {
  isSyncing: boolean;
  onRefresh: () => void;
  style?: StyleProp<ViewStyle>;
}

export const RefreshButton = memo(
  ({ isSyncing, onRefresh, style }: RefreshButtonProps) => {
    const { primary } = useColors();

    return (
      <TouchableOpacity
        onPress={onRefresh}
        disabled={isSyncing}
        style={[
          styles.refreshBtn,
          { backgroundColor: withOpacity(primary, 0.1) },
          style,
        ]}
      >
        {isSyncing ? (
          <ActivityIndicator size={14} color={primary} />
        ) : (
          <>
            <RefreshCw size={14} color={primary} />
            <Text style={[styles.btnText, { color: primary }]}>Yenile</Text>
          </>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  btnText: { marginLeft: 4, fontSize: 12, fontWeight: "600" },
});
