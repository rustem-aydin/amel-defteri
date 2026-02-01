import { useColors } from "@/theme/useColors";
import React from "react";
import { ActivityIndicator, View } from "react-native";

interface DeedListLoadingProps {
  ListHeaderComponent?: React.ReactElement | null;
}

export const DeedListLoading = ({
  ListHeaderComponent,
}: DeedListLoadingProps) => {
  const { active } = useColors();

  return (
    <View style={{ flex: 1, paddingTop: 20, width: "100%" }}>
      {ListHeaderComponent}
      <ActivityIndicator
        size="large"
        color={active}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};
