"use client";
import AdForm from "@/src/components/AdForm";

const locationDefault = {
  lng: -121.9362816,
  lat: 37.3358592,
};

export default function NewAdPage() {
  return <AdForm defaultLocation={locationDefault} />;
}
