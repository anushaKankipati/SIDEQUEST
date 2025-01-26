"use client";
import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { FormattedAutocompleteLocation } from "@/libs/types";
import { Location } from "./LocationPicker";

interface AutoCompleteMapProps {
  mapHeight?: string;
  onLocationChange: (location: Location) => void;
  onFormattedLocationChange: (location: FormattedAutocompleteLocation) => void;
}

const libs: Library[] = ["core", "maps", "marker", "places"];
export default function AutoCompleteMap({
  mapHeight,
  onLocationChange,
  onFormattedLocationChange,
}: AutoCompleteMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autoComplete, setAutoComplete] =
    useState<google.maps.places.Autocomplete>();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_KEY as string,
    libraries: libs,
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const placesAutoCompleteRef = useRef<HTMLInputElement>(null);
  const currentLocation = useCurrentLocation((state) => state.currLocation);
  const setCurrentLocation = useCurrentLocation(
    (state) => state.setCurrLocation
  );
  const [place, setPlace] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && google && google.maps && google.maps.places) {
      const mapOptions = {
        center: currentLocation,
        zoom: 17,
        id: "google-map-script",
        mapId: "autocomplete-map",
      };
      const gMap = new google.maps.Map(
        mapRef.current as HTMLDivElement,
        mapOptions
      );

      //setup autocomplete
      const autoCompleteOptions = {
        fields: [
          "formatted_address",
          "name",
          "geometry",
          "vicinity",
          "place_id",
        ],
      };
      const googleAutoComplete = new google.maps.places.Autocomplete(
        placesAutoCompleteRef.current as HTMLInputElement,
        autoCompleteOptions
      );
      setAutoComplete(googleAutoComplete);
      setMap(gMap);
    }
  }, [isLoaded]);

  function setMarker(location: google.maps.LatLng, name: string) {
    if (!map) {
      return;
    }
    map.setCenter(location);
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: location,
      title: "Marker",
    });
  }

  // Infowindow library for info pop ups

  useEffect(() => {
    if (autoComplete) {
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        onFormattedLocationChange({
          formatted_address: place.formatted_address as string,
          name: place.name as string,
          location: {
            lng: place.geometry?.location?.lng() as number,
            lat: place.geometry?.location?.lat() as number,
          },
          vicinity: place.vicinity as string,
          place_id: place.place_id as string,
        });
        onLocationChange({
          lng: place.geometry?.location?.lng() as number,
          lat: place.geometry?.location?.lat() as number,
        });
        setPlace(place.formatted_address as string);
        const position = place.geometry?.location;
        if (position) {
          setMarker(position, place.name!);
        } // TODO: quirk to work out later: let the default location be displayed before the autocomplete
        // else {
        //   const currentPosition = new google.maps.LatLng({
        //     lat: currentLocation?.lat as number,
        //     lng: currentLocation?.lng as number,
        //   });
        //   setMarker(currentPosition, "");
        // }
      });
    }
  }, [autoComplete]);
  if (!isLoaded || !google || !google.maps || !google.maps.places) {
    return (
      <div className="flex flex-col space-y-1">
        <p>Loading Google Maps...</p>
        <p>
          If this issue persists for longer than a few seconds, refresh the page
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="Quest Location"
        ref={placesAutoCompleteRef}
      />
      <label>{place}</label>

      <div style={{ height: mapHeight }} ref={mapRef} />
    </div>
  );
}
