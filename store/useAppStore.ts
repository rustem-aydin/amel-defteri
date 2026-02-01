import { format } from "date-fns";
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
  // Global App State
  selectedDate: string;
  viewMode: ViewMode;
  isFilterOpen: boolean;

  // Filtre State'i
  filters: FilterState;

  // Actions
  setSelectedDate: (date: string) => void;
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

export const useAppStore = create<AppState>((set) => ({
  selectedDate: format(new Date(), "yyyy-MM-dd"),
  viewMode: "info",
  isFilterOpen: false,

  filters: initialFilters,

  setSelectedDate: (date) => set({ selectedDate: date }),
  goToToday: () => set({ selectedDate: format(new Date(), "yyyy-MM-dd") }),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleFilterModal: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  resetFilters: () => set({ filters: initialFilters }),
}));
