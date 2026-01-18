import { Sun } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SvgUri } from "react-native-svg";

export const DeedIcon = React.memo(
  ({ url, color }: { url?: string; color: string }) => (
    <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
      {url ? (
        <SvgUri uri={url} width={24} height={24} />
      ) : (
        <Sun size={24} color={color} />
      )}
    </View>
  )
);

const styles = StyleSheet.create({
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
