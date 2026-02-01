import { Spacing } from "@/theme/globals";
import { useColor } from "@/theme/useColor";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export const DeedDetailTemplate = ({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) => {
  const backgroundColor = useColor("background");
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {header}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: 50 },
});
