// store/useSyncStore.ts
import { create } from "zustand";

interface SyncState {
  version: number;
  isSyncing: boolean;
  bumpVersion: () => void;
  setIsSyncing: (syncing: boolean) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  version: 0,
  isSyncing: false,
  bumpVersion: () => set((state) => ({ version: state.version + 1 })),
  setIsSyncing: (syncing: boolean) => set({ isSyncing: syncing }),
}));
