import { create } from "zustand";
import { defaultRadius } from "@/libs/helpers";

interface RadiusStore {
  radius: number;
  setRadius: (radius: number) => void;
}

const useRadius = create<RadiusStore>((set) => ({
  radius: defaultRadius,
  setRadius: (newRadius) => set({ radius: newRadius }),
}));

export default useRadius;
