import { View } from "@/components/ui/view";
import { useBottomTabOverflow } from "@/hooks/useBottomTabOverflow";
import { useColor } from "@/theme/useColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { PropsWithChildren, ReactElement } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

type Props = PropsWithChildren<{
  headerHeight?: number;
  headerImage: ReactElement;
  showBackButton?: boolean;
}>;

export function ParallaxScrollView({
  children,
  headerHeight = 250,
  headerImage,
  showBackButton,
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const backgroundColor = useColor("background");
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Animated.View
          style={[
            {
              backgroundColor,
              overflow: "hidden",
              height: headerHeight,
            },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
          {showBackButton && (
            <Pressable
              onPress={() => router.back()}
              style={{
                position: "absolute",
                top: insets.top + 8,
                left: 16,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(0,0,0,0.4)",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <Ionicons name="chevron-back" size={22} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <View
          style={{
            flex: 1,
            padding: 16,
            gap: 16,
            overflow: "hidden",
            backgroundColor,
          }}
        >
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
