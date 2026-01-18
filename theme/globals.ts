import { Dimensions, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Layout = {
  window: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  isSmallDevice: SCREEN_WIDTH < 375,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenPadding: 20, // Ekranın kenarlarından bırakılacak ana boşluk
};

export const Typography = {
  h1: 34,
  h2: 24,
  h3: 20,
  body: 17, // Senin FONT_SIZE değerin
  subtext: 15,
  caption: 13,
  tiny: 11,
};

export const Sizes = {
  // Mevcutların
  HEIGHT: 48,
  FONT_SIZE: Typography.body,
  BORDER_RADIUS: 12, // Genelde 12-16 arası modern durur, 26 çok ovaldir
  CORNERS: 999,
  ICON_BUTTON_SIZE: 38,

  // Eklemek istediklerin
  INPUT_HEIGHT: 52,
  TAB_BAR_HEIGHT: Platform.OS === "ios" ? 88 : 64,
  ICON_XS: 16,
  ICON_SM: 20,
  ICON_MD: 24, // Standart ikon boyutu
  ICON_LG: 32,
};

export const Shadow = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};
