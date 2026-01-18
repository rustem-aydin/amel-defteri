import { Icon } from "@/components/ui/icon";
import { useModeToggle } from "@/hooks/useModeToggle";
import { useColor } from "@/theme/useColor";
import { Moon, Sun } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

// export function ThemeToggle() {
//   const { isDark, mode, setMode, toggleMode } = useModeToggle();
//   return (
//     <Button
//       onPress={() => {
//         switchTheme({
//           switchThemeFunction: toggleMode,
//           animationConfig: {
//             type: "fade",
//             duration: 900,
//           },
//         });
//       }}
//     >
//       asd
//     </Button>
//   );
// }
export function ThemeToggle() {
  const { isDark, toggleMode, mode } = useModeToggle();
  const iconBg = useColor("iconBg");
  return (
    <TouchableOpacity
      onPress={toggleMode}
      style={{
        backgroundColor: iconBg,
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Icon name={isDark === true ? Moon : Sun} size={24} />
    </TouchableOpacity>
  );
}
