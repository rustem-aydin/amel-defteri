import { Colors } from "@/theme/colors";
import { Clock, Search } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  search: string;
  onSearchChange: (text: string) => void;
  isLiveOnly: boolean;
  onToggleLive: () => void;
}

export const LibrarySearchBar = ({
  search,
  onSearchChange,
  isLiveOnly,
  onToggleLive,
}: Props) => (
  <View style={styles.container}>
    <View style={styles.bar}>
      <Search size={18} color="rgba(255,255,255,0.3)" />
      <TextInput
        placeholder="Kütüphanede ara..."
        placeholderTextColor="rgba(255,255,255,0.2)"
        style={styles.input}
        value={search}
        onChangeText={onSearchChange}
      />
    </View>
    <TouchableOpacity
      onPress={onToggleLive}
      style={[
        styles.btn,
        isLiveOnly && { backgroundColor: Colors.dark.primary },
      ]}
    >
      <Clock size={20} color={isLiveOnly ? "#000" : "rgba(255,255,255,0.4)"} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 15,
  },
  bar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1A12",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  input: { flex: 1, color: "#fff", marginLeft: 8, fontSize: 14 },
  btn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#0D1A12",
    justifyContent: "center",
    alignItems: "center",
  },
});
