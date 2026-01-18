// components/library/TimeText.tsx
import { Text } from "@/components/ui/text";
import React, { useEffect, useState } from "react";

export const TimeText = ({ calculateFn }: { calculateFn: () => string }) => {
  const [display, setDisplay] = useState(calculateFn());

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplay(calculateFn());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateFn]);

  return <Text style={{ fontSize: 12, color: "#999" }}>{display}</Text>;
};
