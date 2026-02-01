import { useStreak } from "@/db/hooks/useAllQueries";
import { withOpacity } from "@/theme/colors";
import { useColors } from "@/theme/useColors";
import React from "react";
import { StyleSheet, View } from "react-native";

interface DeedInfoLevelProps {
  themeColor: string;
  item_id: number;
}

const DeedInfoLevel = ({ themeColor, item_id }: DeedInfoLevelProps) => {
  const { green } = useColors();
  const color = themeColor || green;

  const { data: streakCount = 0 } = useStreak(item_id);

  return (
    <View style={styles.circlesContainer}>
      {Array.from({ length: 21 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.circleDot,
            {
              backgroundColor:
                index < streakCount ? color : withOpacity(color, 0.2),
            },
          ]}
        />
      ))}
    </View>
  );
};

export default DeedInfoLevel;

const styles = StyleSheet.create({
  circlesContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 3,
  },
  circleDot: {
    width: 6,
    height: 14,
    marginRight: 1,
    borderRadius: 3,
  },
});
