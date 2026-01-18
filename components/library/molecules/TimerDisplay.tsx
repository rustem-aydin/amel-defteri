// components/library/molecules/TimerDisplay.tsx
import { NumberTicker } from "@/components/ui/NumberTicker";
import { Text } from "@/components/ui/text";
import { Colors } from "@/theme/colors";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export const TimerDisplay = memo(({ endTime }: { endTime: Date }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  let diff = endTime.getTime() - now.getTime();
  if (diff < 0) diff += 24 * 60 * 60 * 1000;

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return (
    <View style={styles.timerRow}>
      <Text style={styles.timerLabel}>Kalan:</Text>
      <NumberTicker value={h} />
      <Text style={styles.sep}>:</Text>
      <NumberTicker value={m} />
      <Text style={styles.sep}>:</Text>
      <NumberTicker value={s} />
    </View>
  );
});

const styles = StyleSheet.create({
  timerRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  timerLabel: { fontSize: 10, color: "rgba(255,255,255,0.4)", marginRight: 4 },
  sep: { color: Colors.dark.primary, marginHorizontal: 1, fontWeight: "900" },
});
