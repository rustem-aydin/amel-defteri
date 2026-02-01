import { Coordinates, LocationState } from "@/types/deed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// State arayüzünü güncelliyoruz
interface LocationStore extends LocationState {
  _hasHydrated: boolean; // Depolama yüklendi mi kontrolü
  setHasHydrated: (state: boolean) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      coords: null,
      loading: false,
      error: null,
      _hasHydrated: false, // Başlangıçta false

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      fetchLocation: async () => {
        // İsteğe bağlı: Zaten coords varsa çekmesin istiyorsanız burayı açabilirsiniz
        // if (get().coords) return;

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

          const newCoords: Coordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          set({ coords: newCoords, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
    }),
    {
      name: "location-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // BU KISIM ÖNEMLİ: AsyncStorage verisi yüklendiğinde çalışır
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
