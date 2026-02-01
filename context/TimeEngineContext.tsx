import { TimeRefs, useTimeEngine } from "@/hooks/useTimeEngine";
import { useLocationStore } from "@/store/useLocationStore";
import React, { createContext, ReactNode, useContext } from "react";

// Context oluşturuluyor
const TimeEngineContext = createContext<TimeRefs | null>(null);

// Provider Bileşeni
export const TimeEngineProvider = ({ children }: { children: ReactNode }) => {
  const coords = useLocationStore((state) => state.coords);

  const references = useTimeEngine(coords);

  return (
    <TimeEngineContext.Provider value={references}>
      {children}
    </TimeEngineContext.Provider>
  );
};

export const useTimeReferences = () => {
  const context = useContext(TimeEngineContext);
  return context;
};
