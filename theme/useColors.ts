import { useColor } from "./useColor";

export const useColors = () => {
  return {
    background: useColor("background"),
    primaryForeground: useColor("primaryForeground"),
    foreground: useColor("foreground"),
    card: useColor("card"),
    green: useColor("green"),
    cardBorder: useColor("cardBorder"),
    iconBg: useColor("iconBg"),

    text: useColor("text"),
    textMuted: useColor("textMuted"),

    primary: useColor("primary"),
    active: useColor("active"),
    secondary: useColor("secondary"),

    destructive: useColor("destructive"),
    success: useColor("success"),
    warning: useColor("warning"),
    info: useColor("info"),

    border: useColor("border"),
    ring: useColor("ring"),
    transparent: "transparent",
  } as const;
};
