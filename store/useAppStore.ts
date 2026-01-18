// store/useAppStore.ts
import { format } from "date-fns";
import { create } from "zustand";

interface FilterState {
  status: string | null;
  category: string;
}

interface AppState {
  selectedDate: string;
  isLiveOnly: boolean;
  isFilterOpen: boolean;
  filters: FilterState;

  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  toggleLiveOnly: () => void;
  toggleFilterModal: () => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedDate: format(new Date(), "yyyy-MM-dd"),
  isLiveOnly: false,
  isFilterOpen: false,
  filters: { status: null, category: "Tümü" },

  setSelectedDate: (date) => set({ selectedDate: date }),
  goToToday: () => set({ selectedDate: format(new Date(), "yyyy-MM-dd") }),
  toggleLiveOnly: () => set((state) => ({ isLiveOnly: !state.isLiveOnly })),
  toggleFilterModal: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => set({ filters: { status: null, category: "Tümü" } }),
}));
