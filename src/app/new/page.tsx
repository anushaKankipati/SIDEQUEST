"use client";
import AdForm from "@/src/components/AdForm";
import useCurrentLocation from "@/src/hooks/useCurrentLocation";
import { Location } from "../../components/LocationPicker";

export default function NewAdPage() {
  const center = useCurrentLocation((state) => state.currLocation);
  return <AdForm defaultLocation={center as Location} />;
}
