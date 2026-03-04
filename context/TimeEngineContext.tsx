import { IslamicTimeState, useTimeEngine } from "@/hooks/useTimeEngine";
import { useLocationStore } from "@/store/useLocationStore";
import { useAppStore } from "@/store/useAppStore";
import React, { createContext, ReactNode, useContext, useEffect } from "react";

// Context oluşturuluyor
const TimeEngineContext = createContext<IslamicTimeState | null>(null);

// Provider Bileşeni
export const TimeEngineProvider = ({ children }: { children: ReactNode }) => {
  const coords = useLocationStore((state) => state.coords);

  const engine = useTimeEngine(coords);

  // 🌙 Akşam namazından sonra effectiveHijriToday'i güncelle
  const setEffectiveHijriToday = useAppStore((s) => s.setEffectiveHijriToday);
  useEffect(() => {
    if (engine?.effectiveDateHijri) {
      setEffectiveHijriToday(engine.effectiveDateHijri);
    }
  }, [engine?.effectiveDateHijri, setEffectiveHijriToday]);

  return (
    <TimeEngineContext.Provider value={engine}>
      {children}
    </TimeEngineContext.Provider>
  );
};

export const useTimeReferences = () => {
  const context = useContext(TimeEngineContext);
  return context;
};
