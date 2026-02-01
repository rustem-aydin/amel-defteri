import { Text } from "@/components/ui/text";
import { Spacing, Typography } from "@/theme/globals";
import { useColors } from "@/theme/useColors";
import React from "react";
import { StyleSheet, View } from "react-native";
import DeedInfoLevel from "./DeedInfoLevel";
import { DeedTime } from "./DeedTime";

const getStatusText = (status: string, isDone: boolean, isPast: boolean) => {
  if (isPast && !isDone) return "Tamamlanamadı";
  switch (status) {
    case "not_started":
      return "Vakti Bekleniyor";
    case "active":
      return "Vakti Girdi";
    case "completed":
      return "Tamamlandı";
    default:
      return "Bekleniyor";
  }
};

interface DeedInfoProps {
  item: any;
  viewMode: string;
  isPastDate: boolean;
  isDone: boolean;
  status: string;
  themeColor: string;
  references: any;
}

export const DeedInfo = React.memo(
  ({
    item,
    viewMode,
    isPastDate,
    isDone,
    status,
    themeColor,
    references,
  }: DeedInfoProps) => {
    const { text, textMuted, red, green } = useColors();
    const displayStatus =
      item?.statusName || getStatusText(status, isDone, isPastDate);
    const renderSubtitle = () => {
      if (isPastDate && !isDone) {
        return (
          <Text style={{ color: red, fontWeight: "600", fontSize: 13 }}>
            Tamamlanamadı
          </Text>
        );
      }

      if (viewMode === "info") {
        return (
          <Text style={{ color: textMuted, fontSize: 13, fontWeight: "500" }}>
            <Text
              style={{ color: themeColor, fontWeight: "700", paddingRight: 2 }}
            >
              {displayStatus}
            </Text>
          </Text>
        );
      }

      if (viewMode === "level") {
        return (
          <DeedInfoLevel
            item_id={item?.deedId || item?.id} // ✅ Her iki durumu kontrol et
            themeColor={themeColor}
          />
        );
      }
      if (isDone) {
        return (
          <Text style={{ color: green, fontWeight: "600", fontSize: 13 }}>
            Tamamlandı
          </Text>
        );
      }

      return (
        <DeedTime
          start_ref={item?.startRef}
          end_ref={item?.endRef}
          references={references}
        />
      );
    };

    return (
      <View style={styles.info}>
        <Text
          style={[styles.title, { color: text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.title}
        </Text>
        <View>{renderSubtitle()}</View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    height: 42,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  title: {
    fontSize: Typography.body,
    fontWeight: "700",
  },
});
