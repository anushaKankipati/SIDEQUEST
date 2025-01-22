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
  const isLoaded = useGoogleMapsLoader();

  useEffect(() => {
    if (!isLoaded || !divRef.current) return;

    const map = new google.maps.Map(divRef.current, {
      mapId: "map",
      center: defaultLocation,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
    });

    const marker = new google.maps.Marker({
      position: defaultLocation,
      map,
    });

    map.addListener("click", (ev: any) => {
      const lat = ev.latLng.lat();
      const lng = ev.latLng.lng();
      marker.setPosition({ lat, lng });
      onChange({ lng, lat });
    });
  }, [isLoaded, gpsCoords]);

  return <div ref={divRef} id="map" className="w-full h-[200px]" />;
}
