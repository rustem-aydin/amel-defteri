/* components/library/UpdateBadge.tsx */
import { Text } from "@/components/ui/text";
import { useUpdateManager } from "@/hooks/useUpdateManager"; // Hook'u buraya aldık
import { withOpacity } from "@/theme/colors";
import { useColors } from "@/theme/useColors";
import { DownloadCloud } from "lucide-react-native";
import React, { memo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export const UpdateBadge = memo(() => {
  const { primary } = useColors();

  // 🔥 TÜM MANTIK ARTIK BURADA (Local Scope)
  // Bu hook çalıştığında LibraryScreen haberdar olmaz, sadece bu buton bilir.
  const { isUpdateAvailable, isSyncing, triggerSync } = useUpdateManager();

  // Güncelleme yoksa ve sync yapılmıyorsa bileşeni render etme (Görünmez)
  if (!isUpdateAvailable && !isSyncing) return null;

  return (
    <TouchableOpacity
      onPress={triggerSync}
      disabled={isSyncing}
      style={[
        styles.badge,
        {
          backgroundColor: withOpacity(primary, 0.15),
          borderColor: withOpacity(primary, 0.3),
        },
      ]}
    >
      {isSyncing ? (
        <View style={styles.content}>
          <ActivityIndicator size={12} color={primary} />
          <Text style={[styles.text, { color: primary }]}>
            Güncelleniyor...
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <DownloadCloud size={14} color={primary} />
          <Text style={[styles.text, { color: primary }]}>
            Güncelleme Mevcut
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
