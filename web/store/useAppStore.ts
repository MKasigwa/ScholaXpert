import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Types for selection state only
export interface Tenant {
  id: string;
  name: string;
  code: string;
  type?: string;
  logo?: string;
  status?: string;
}

export interface SchoolYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isDefault: boolean;
  isCurrent?: boolean;
  status?: string;
}

interface AppState {
  // Selection State Only
  selectedTenant: Tenant | null;
  selectedYear: SchoolYear | null;

  // Actions
  setSelectedTenant: (tenant: Tenant | null) => void;
  setSelectedYear: (year: SchoolYear | null) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  selectedTenant: null,
  selectedYear: null,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Actions
        setSelectedTenant: (tenant) => set({ selectedTenant: tenant }),
        setSelectedYear: (year) => set({ selectedYear: year }),

        // Reset
        reset: () => set(initialState),
      }),
      {
        name: "scholaxpert-app-storage",
        partialize: (state) => ({
          selectedTenant: state.selectedTenant,
          selectedYear: state.selectedYear,
        }),
      }
    )
  )
);
