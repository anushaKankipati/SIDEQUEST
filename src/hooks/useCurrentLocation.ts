import { create } from "zustand";
import { Location } from "../components/LocationPicker";

const locationDefault: Location = {
  lng: -121.9368, 
  lat: 37.3489
}

interface CurrentLocationStore {
  currLocation?: Location | null;
  setCurrLocation: (location: Location | null) => void;
}

const useCurrentLocation = create<CurrentLocationStore>((set) => ({
  currLocation: locationDefault,
  setCurrLocation: (location) => set({ currLocation: location }),
}));

export default useCurrentLocation;
