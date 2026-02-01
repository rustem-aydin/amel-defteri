const lightColors = {
  background: "#FFFFFF",
  surahResources: "#FF8787",
  hadithResources: "#B6E2A1",
  othersResources: "#FFFBC1",
  foreground: "#09090b",
  card: "#FFFFFF", // Düzeltildi: Açık temada kart beyaz olmalı
  cardBorder: "#e4e4e7", // Düzeltildi
  iconBg: "#f4f4f5", // Düzeltildi
  cardForeground: "#09090b",
  popover: "#FFFFFF",
  popoverForeground: "#09090b",
  primary: "#18181b",
  primaryForeground: "#FFFFFF",
  secondary: "#f4f4f5",
  secondaryForeground: "#18181b",
  muted: "#f4f4f5",
  mutedForeground: "#71717a",
  accent: "#f4f4f5",
  accentForeground: "#18181b",
  destructive: "#ef4444",
  destructiveForeground: "#FFFFFF",
  border: "#e4e4e7",
  input: "#e4e4e7",
  ring: "#a1a1aa",
  text: "#000000",
  textMuted: "#71717a",
  tint: "#18181b",
  icon: "#71717a",
  tabIconDefault: "#71717a",
  tabIconSelected: "#18181b",
  active: "#10b981",

  // Semantic Colors
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#3b82f6",
  error: "#ef4444",

  // iOS Style Colors
  blue: "#007AFF",
  green: "#34C759",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  pink: "#FF2D92",
  purple: "#AF52DE",
  teal: "#5AC8FA",
  indigo: "#5856D6",
  transparent: "transparent",
};

const darkColors = {
  surahResources: "#FF8787",
  hadithResources: "#B6E2A1",
  othersResources: "#FFFBC1",
  background: "#050F08",
  foreground: "#FFFFFF",
  card: "#0A1A10",
  cardBorder: "#033322",
  iconBg: "rgba(22, 37, 27, 0.8)",
  cardForeground: "#FFFFFF",
  popover: "#09090b",
  popoverForeground: "#FFFFFF",
  primary: "#FFFFFF",
  primaryForeground: "#09090b",
  secondary: "#27272a",
  secondaryForeground: "#FFFFFF",
  muted: "#27272a",
  mutedForeground: "#a1a1aa",
  accent: "#27272a",
  accentForeground: "#FFFFFF",
  destructive: "#7f1d1d",
  destructiveForeground: "#FFFFFF",
  border: "#27272a",
  input: "#27272a",
  ring: "#d4d4d8",
  text: "#FFFFFF",
  textMuted: "#a1a1aa",
  tint: "#FFFFFF",
  icon: "#a1a1aa",
  tabIconDefault: "#a1a1aa",
  tabIconSelected: "#FFFFFF",
  active: "#10b981",

  // Semantic Colors
  success: "#16a34a",
  warning: "#d97706",
  info: "#2563eb",
  error: "#dc2626",

  // iOS Style Colors
  blue: "#0A84FF",
  green: "#30D158",
  red: "#FF453A",
  orange: "#FF9F0A",
  yellow: "#FFD60A",
  pink: "#FF375F",
  purple: "#BF5AF2",
  teal: "#64D2FF",
  indigo: "#5E5CE6",
  transparent: "transparent",
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Tek bir tip tanımı her iki tema için de ortak anahtarları garanti eder
export type AppTheme = typeof lightColors;
export type ColorKeys = keyof AppTheme;

/**
 * HEX renklerini RGBA formatına çevirir.
 * 3 ve 6 haneli hex kodlarını destekler.
 */
export const withOpacity = (color: string, opacity: number): string => {
  if (!color || color === "transparent") return "transparent";

  if (color.startsWith("rgba")) {
    return color.replace(/[^,]+(?=\))/, ` ${opacity}`);
  }

  if (color.startsWith("#")) {
    let hex = color.replace("#", "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
};
