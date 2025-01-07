import { create } from "zustand";
import { Location } from "../components/LocationPicker";

interface CurrentLocationStore {
  currLocation?: Location | null;
  setCurrLocation: (location: Location | null) => void;
}

const useCurrentLocation = create<CurrentLocationStore>((set) => ({
  currLocation: null,
  setCurrLocation: (location) => set({ currLocation: location }),
}));

export default useCurrentLocation;
