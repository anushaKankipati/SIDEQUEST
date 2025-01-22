import { useEffect, useRef } from "react";
import useGoogleMapsLoader from "../hooks/useGoogleMapsLoader";

export type Location = {
  lat: number;
  lng: number;
};

export default function LocationPicker({
  defaultLocation,
  onChange,
  gpsCoords,
}: {
  defaultLocation: Location;
  onChange: (location: Location) => void;
  gpsCoords: Location | null;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null); // Ref to store the map instance
  const markerRef = useRef<google.maps.Marker | null>(null); // Ref to store the marker instance
  const isLoaded = useGoogleMapsLoader();

  // Initialize the map and marker
  useEffect(() => {
    if (!isLoaded || !divRef.current) return;

    // Create the map instance if not already initialized
    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(divRef.current, {
        mapId: "map",
        center: defaultLocation,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
      });

      // Create the marker instance
      markerRef.current = new google.maps.Marker({
        position: defaultLocation,
        map: mapRef.current,
      });

      // Add click listener to the map
      mapRef.current.addListener("click", (ev: any) => {
        const lat = ev.latLng.lat();
        const lng = ev.latLng.lng();
        markerRef.current?.setPosition({ lat, lng });
        onChange({ lng, lat });
      });
    }
  }, [isLoaded]);

  // Recenter the map and update the marker when `defaultLocation` changes
  useEffect(() => {
    if (isLoaded && mapRef.current && markerRef.current) {
      // Recenter the map to the new location
      mapRef.current.setCenter(defaultLocation);

      // Update the marker's position to the new location
      markerRef.current.setPosition(defaultLocation);
    }
  }, [isLoaded, defaultLocation]);

  return <div ref={divRef} id="map" className="w-full h-[200px]" />;
}
