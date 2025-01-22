import { useEffect, useRef } from "react";
import useGoogleMapsLoader from "../hooks/useGoogleMapsLoader";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { LatLng } from "use-places-autocomplete";

export type Location = {
  lat: number;
  lng: number;
};

export default function LocationPicker({
  location,
  onChange,
  gpsCoords,
}: {
  location?: Location;
  onChange: (location: Location) => void;
  gpsCoords: Location | null;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null); // Ref to store the map instance
  const markerRef = useRef<google.maps.Marker | null>(null); // Ref to store the marker instance
  const isLoaded = useGoogleMapsLoader();
  const currentLocation = useCurrentLocation((state) => state.currLocation);

  // Initialize the map and marker
  useEffect(() => {
    if (!isLoaded || !divRef.current) return;

    // Create the map instance if not already initialized
    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(divRef.current, {
        mapId: "map",
        center: location ? location : currentLocation,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
      });

      // Create the marker instance
      markerRef.current = new google.maps.Marker({
        position: location ? location : currentLocation,
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

  // Recenter the map and update the marker when `location` changes
  useEffect(() => {
    if (isLoaded && mapRef.current && markerRef.current) {
      mapRef.current.setCenter(location as LatLng);
      markerRef.current.setPosition(location);
    }
  }, [isLoaded, location]);

  return <div ref={divRef} id="map" className="w-full h-[200px]" />;
}
