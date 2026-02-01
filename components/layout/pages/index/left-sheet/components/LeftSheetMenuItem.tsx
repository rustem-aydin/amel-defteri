import { Text } from "@/components/ui/text";
import { useColors } from "@/theme/useColors";
import { ChevronRight } from "lucide-react-native";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";

export const MenuItem = ({
  icon: IconComponent,
  title,
  onPress,
  isSwitch,
  switchValue,
  onSwitchChange,
}: any) => {
  const { textMuted, primary, card, cardBorder } = useColors();
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([
        styles.glassCard,
        { backgroundColor: card, borderColor: cardBorder },
      ])}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: isSwitch
                ? "rgba(255,255,255,0.05)"
                : "rgba(19, 236, 91, 0.1)",
            },
          ]}
        >
          <IconComponent size={20} color={isSwitch ? textMuted : primary} />
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>

      {isSwitch ? (
        <Switch
          trackColor={{ false: "#334155", true: primary }}
          thumbColor={"#fff"}
          ios_backgroundColor="#334155"
          onValueChange={onSwitchChange}
          value={switchValue}
        />
      ) : (
        <ChevronRight size={20} color="#64748b" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  glassCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
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
});
