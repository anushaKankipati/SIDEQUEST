import { create } from "zustand";

interface CurrentLocationStore {
  isPayingHourly?: boolean;
  setIsPayingHourly: (location?: boolean | undefined) => void;
}

const useIsPayingHourly = create<CurrentLocationStore>((set) => ({
  currLocation: undefined,
  setIsPayingHourly: (isPayingHourly) => set({ isPayingHourly: isPayingHourly }),
}));

export default useIsPayingHourly;
