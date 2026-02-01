import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function FloatingMenu() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 6,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleDeedClick = () => {
    router.push("/library"); // veya router.push(`/deed/${id}`);
    toggleMenu();
  };

  const menuScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const menuOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const menuTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const buttonRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <>
      {/* Backdrop Blur */}
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <BlurView
            intensity={80}
            style={StyleSheet.absoluteFill}
            tint="dark"
          />
        </TouchableOpacity>
      )}

      {/* Floating Menu Container */}
      <View style={[styles.floatingContainer, { bottom: insets.bottom + 32 }]}>
        {/* Menu Item - Ameller */}
        <Animated.View
          style={[
            styles.menuItem,
            {
              opacity: menuOpacity,
              transform: [{ scale: menuScale }, { translateY: menuTranslate }],
            },
          ]}
          pointerEvents={isOpen ? "auto" : "none"}
        >
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleDeedClick}
            activeOpacity={0.8}
          >
            <Text style={styles.menuIcon}>📝</Text>
            <Text style={styles.menuText}>Ameller</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Main Floating Button */}
        <TouchableOpacity
          style={[styles.mainButton, isOpen && styles.mainButtonOpen]}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Animated.Text
            style={[
              styles.plusIcon,
              { transform: [{ rotate: buttonRotation }] },
            ]}
          >
            +
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  floatingContainer: {
    position: "absolute",
    right: 20,
    zIndex: 1000,
  },
  menuItem: {
    position: "absolute",
    bottom: 90,
    right: 0,
    minWidth: 150,
  },
  menuButton: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  menuText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  mainButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  mainButtonOpen: {
    backgroundColor: "#ef4444",
  },
  plusIcon: {
    fontSize: 36,
    color: "#ffffff",
    fontWeight: "300",
  },
});
