import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColors } from "@/theme/useColors";
import { AntDesign } from "@expo/vector-icons";
import {
  BarChart2,
  Bell,
  Calendar,
  EyeOff,
  Trophy,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LeftSheetLocation from "./components/LeftSheetLocation";
import { MenuItem } from "./components/LeftSheetMenuItem";
import LeftSheetProfile from "./components/LeftSheetProfile";
import LeftSheetTotalPoints from "./components/LeftSheetTotalPoints";

export function SheetNavigation() {
  const [open, setOpen] = useState(false);
  const [hidePoints, setHidePoints] = useState(false);
  const insets = useSafeAreaInsets();

  const { background, cardBorder } = useColors();
  return (
    <Sheet open={open} onOpenChange={setOpen} side="left">
      <SheetTrigger asChild>
        <TouchableOpacity>
          <AntDesign name="align-left" size={24} color="#fff" />
        </TouchableOpacity>
      </SheetTrigger>

      <SheetContent
        style={{
          backgroundColor: background,
          padding: 0,
          borderRightColor: cardBorder,
          borderRightWidth: 1,
        }}
      >
        <View
          style={[
            styles.container,
            { paddingTop: insets.top + 20, backgroundColor: background },
          ]}
        >
          <View style={styles.headerSection}>
            <LeftSheetProfile />
            <Separator style={{ marginVertical: 10 }} />

            <LeftSheetTotalPoints />
          </View>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <LeftSheetLocation />
            <Text style={styles.sectionTitle}>İSTATİSTİK VE ANALİZ</Text>
            <View style={styles.menuGroup}>
              <MenuItem
                icon={BarChart2}
                title="Haftalık Analizler"
                onPress={() => {}}
              />
              <MenuItem
                icon={Trophy}
                title="Amel İstatistikleri"
                onPress={() => {}}
              />
              <MenuItem
                icon={Users}
                title="Grup Başarıları"
                onPress={() => {}}
              />
              <MenuItem
                icon={Calendar}
                title="Hicri Takvim"
                onPress={() => {}}
              />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              AYARLAR
            </Text>
            <View style={styles.menuGroup}>
              <MenuItem
                icon={EyeOff}
                title="Puanları Gizle"
                isSwitch={true}
                switchValue={hidePoints}
                onSwitchChange={setHidePoints}
              />
              <MenuItem
                icon={Bell}
                title="Bildirim Ayarları"
                onPress={() => {}}
              />
            </View>
          </ScrollView>
        </View>
      </SheetContent>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50, // Avatarı biraz küçülttük denge için
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(19, 236, 91, 0.4)",
  },

  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: -0.5,
  },

  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginLeft: 12,
    textTransform: "uppercase",
  },
  menuGroup: {
    gap: 10,
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    opacity: 0.5,
  },
  versionText: {
    color: "#cbd5e1",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "bold",
  },
});
