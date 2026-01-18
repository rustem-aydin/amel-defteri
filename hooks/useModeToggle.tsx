import { useState } from "react";
import { Appearance } from "react-native";

// Sadece light ve dark kaldı
type Mode = "light" | "dark";

interface UseModeToggleReturn {
  isDark: boolean;
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

export function useModeToggle(): UseModeToggleReturn {
  // Başlangıçta cihazın o anki temasını al (null gelirse 'dark' varsayalım)
  const [mode, setModeState] = useState<Mode>(
    Appearance.getColorScheme() === "light" ? "light" : "dark"
  );

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    // React Native'e temayı zorla uygulat
    Appearance.setColorScheme(newMode);
  };

  const toggleMode = () => {
    // Sadece iki mod arasında git-gel yapar
    const targetMode = mode === "light" ? "dark" : "light";
    setMode(targetMode);
  };

  return {
    isDark: mode === "dark",
    mode,
    setMode,
    toggleMode,
  };
}
