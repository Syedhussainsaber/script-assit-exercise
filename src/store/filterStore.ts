import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LaunchFilters {
  search: string;
  year: number | null;
  success: boolean | null;
  upcoming: boolean | null;
  sort: string;
  order: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface RocketFilters {
  search: string;
  active: boolean | null;
  sort: string;
  order: 'asc' | 'desc';
}

export interface CrewFilters {
  search: string;
  agency: string;
  status: string;
  sort: string;
  order: 'asc' | 'desc';
}

interface FiltersState {
  // Launch filters
  launchFilters: LaunchFilters;
  setLaunchFilters: (filters: Partial<LaunchFilters>) => void;
  resetLaunchFilters: () => void;
  
  // Rocket filters
  rocketFilters: RocketFilters;
  setRocketFilters: (filters: Partial<RocketFilters>) => void;
  resetRocketFilters: () => void;
  
  // Crew filters
  crewFilters: CrewFilters;
  setCrewFilters: (filters: Partial<CrewFilters>) => void;
  resetCrewFilters: () => void;
}

const DEFAULT_LAUNCH_FILTERS: LaunchFilters = {
  search: '',
  year: null,
  success: null,
  upcoming: null,
  sort: 'date_utc',
  order: 'desc',
  page: 1,
  limit: 10
};

const DEFAULT_ROCKET_FILTERS: RocketFilters = {
  search: '',
  active: null,
  sort: 'name',
  order: 'asc'
};

const DEFAULT_CREW_FILTERS: CrewFilters = {
  search: '',
  agency: '',
  status: '',
  sort: 'name',
  order: 'asc'
};

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      // Launch filters
      launchFilters: DEFAULT_LAUNCH_FILTERS,
      setLaunchFilters: (filters) => 
        set((state) => ({ 
          launchFilters: { ...state.launchFilters, ...filters }
        })),
      resetLaunchFilters: () => 
        set({ launchFilters: DEFAULT_LAUNCH_FILTERS }),
      
      // Rocket filters
      rocketFilters: DEFAULT_ROCKET_FILTERS,
      setRocketFilters: (filters) => 
        set((state) => ({ 
          rocketFilters: { ...state.rocketFilters, ...filters }
        })),
      resetRocketFilters: () => 
        set({ rocketFilters: DEFAULT_ROCKET_FILTERS }),
      
      // Crew filters
      crewFilters: DEFAULT_CREW_FILTERS,
      setCrewFilters: (filters) => 
        set((state) => ({ 
          crewFilters: { ...state.crewFilters, ...filters }
        })),
      resetCrewFilters: () => 
        set({ crewFilters: DEFAULT_CREW_FILTERS }),
    }),
    {
      name: 'spacex-explorer-filters'
    }
  )
);