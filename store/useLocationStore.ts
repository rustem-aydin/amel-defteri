import { Coordinates, LocationState } from "@/types/deed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 1. Sınıf Tanımı (Düzeltildi)

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      coords: null,
      loading: false,
      error: null,

      fetchLocation: async () => {
        set({ loading: true, error: null });
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            set({ error: "İzin verilmedi", loading: false });
            return;
          }

          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          // Artık TS kızmayacak çünkü sınıf düzgün tanımlandı
          const newCoords = new Coordinates(
            location.coords.latitude,
            location.coords.longitude
          );

          set({ coords: { ...newCoords }, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
    }),
    {
      name: "location-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
