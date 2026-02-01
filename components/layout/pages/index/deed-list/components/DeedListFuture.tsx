import { Text } from "@/components/ui/text";
import { Spacing, Typography } from "@/theme/globals";
import { useColors } from "@/theme/useColors";
import React from "react";
import { StyleSheet, View } from "react-native";

interface DeedListFutureProps {
  ListHeaderComponent?: React.ReactElement | null;
}

export const DeedListFuture = ({
  ListHeaderComponent,
}: DeedListFutureProps) => {
  const { textMuted } = useColors();

  return (
    <View style={{ flex: 1 }}>
      {ListHeaderComponent}
      <View style={styles.emptyContainer}>
        <Text
          style={[
            styles.sectionTitle,
            { color: textMuted, fontSize: Typography.body },
          ]}
        >
          Gelecek günler için henüz işlem yapılamaz.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: Spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: "bold",
  },
});
