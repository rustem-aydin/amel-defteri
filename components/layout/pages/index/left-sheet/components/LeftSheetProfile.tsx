import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

const LeftSheetProfile = () => {
  return (
    <View style={styles.profileRow}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvxkisPF5635_H6VORRSVwzIO9hA5GzlmpueAkTdicRGjPL2hI-9TqleZt7UFB5nCnsBJ9pwxcc0V_VgHk1if4gFUSsIjdr7PzRCtfgaXiajNA8IqkSpuoSHYgxXrWdG8decCa_8LtuUtnjHFSMCgHKs41GAPtnJ1cKJFO3YQtjMjhKuq2uxQq8NmGa20Yj6gw2BApk_orKRcpg5B7c8a1xNLfcl4mNIi_7uZ1R5DzkjEPNPxxArKztx7mGCfiskReHUaduUGSA48",
          }}
          style={styles.avatar}
        />
      </View>
      <View>
        <Text style={styles.userName}>Ahmet Yılmaz</Text>
        <Text style={styles.userQuote}>"Ameller niyetlere göredir."</Text>
      </View>
    </View>
  );
};

export default LeftSheetProfile;

const styles = StyleSheet.create({
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
  userQuote: {
    fontSize: 11,
    fontStyle: "italic",
    marginTop: 2,
    opacity: 0.8,
  },
});
