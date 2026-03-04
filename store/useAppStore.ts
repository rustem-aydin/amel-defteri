import { getCurrentHijriDate } from "@/helpers/hijriUtils";
import { create } from "zustand";

export type ViewMode = "info" | "time" | "level";

// Filtrelerin tipi
export interface FilterState {
  search: string;
  status: string | null;
  category: string;
  period: string;
  isLiveOnly: boolean;
}

interface AppState {
  // 🌙 Global App State (HİCRİ TARİH)
  selectedHijriDate: string; // "1446-08-22" formatında
  effectiveHijriToday: string; // Akşam sonrası bir sonraki Hicri gün
  viewMode: ViewMode;
  isFilterOpen: boolean;

  // Filtre State'i
  filters: FilterState;

  // Actions
  setSelectedHijriDate: (hijriDate: string) => void;
  setEffectiveHijriToday: (hijriDate: string) => void;
  goToToday: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleFilterModal: () => void;

  // Filtre Actions
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

// Varsayılan filtre değerleri
const initialFilters: FilterState = {
  search: "",
  status: null,
  category: "Tümü",
  period: "Tümü",
  isLiveOnly: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  // Başlangıç: Bugünün Hicri tarihi
  selectedHijriDate: getCurrentHijriDate(),
  effectiveHijriToday: getCurrentHijriDate(),
  viewMode: "info",
  isFilterOpen: false,

  filters: initialFilters,

  setSelectedHijriDate: (hijriDate) => set({ selectedHijriDate: hijriDate }),
  setEffectiveHijriToday: (hijriDate) => set({ effectiveHijriToday: hijriDate }),
  goToToday: () => set({ selectedHijriDate: get().effectiveHijriToday }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleFilterModal: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () => set({ filters: initialFilters }),
}));
