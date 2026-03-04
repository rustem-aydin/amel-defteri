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
    case "future": // Yeni yapıdaki karşılığı
      return "Vakti Bekleniyor";
    case "active":
      return "Vakti Girdi";
    case "completed":
      return "Tamamlandı";
    case "expired":
      return "Vakti Geçti";
    default:
      return "Bekleniyor";
  }
};

interface DeedInfoProps {
  item: any;
  viewMode: string;
  isPastDate: boolean;
  isFutureDate?: boolean;
  isDone: boolean;
  status: string;
  themeColor: string;
  engine: any;
}

export const DeedInfo = React.memo(
  ({
    item,
    viewMode,
    isPastDate,
    isFutureDate,
    isDone,
    status,
    themeColor,
    engine,
  }: DeedInfoProps) => {
    const { text, textMuted, red, green } = useColors();
    const displayStatus =
      item?.statusName || getStatusText(status, isDone, isPastDate);

    const renderSubtitle = () => {
      if (isFutureDate) {
        return (
          <Text style={{ color: textMuted, fontSize: 13, fontWeight: "500" }}>
            Henüz vakti değil
          </Text>
        );
      }

      if (isPastDate) {
        return isDone ? (
          <Text style={{ color: green, fontWeight: "600", fontSize: 13 }}>
            Tamamlandı
          </Text>
        ) : (
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
            item_id={item?.deedId || item?.id}
            themeColor={item?.statusColor || themeColor}
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

      // DeedTime çağrısı - references buraya aktarılıyor
      return (
        <DeedTime
          start_ref={item?.startRef}
          end_ref={item?.endRef}
          engine={engine}
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
