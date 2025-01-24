"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import useCurrentLocation from "../hooks/useCurrentLocation";


const libs: Library[] = ["core", "maps", "marker", "places"];
export default function AutoCompleteMap() {
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
      const gMap = new google.maps.Map(mapRef.current as HTMLDivElement, mapOptions); 
    
      //setup autocomplete 
      const autoCompleteOptions = {
        fields: ["formatted_address", "name", "geometry", "vicinity", "place_id"], 
      }
      const googleAutoComplete = new google.maps.places.Autocomplete(placesAutoCompleteRef.current as HTMLInputElement, autoCompleteOptions);
      setAutoComplete(googleAutoComplete);
      setMap(gMap);

    }
  }, [isLoaded]);

  function setMarker(location: google.maps.LatLng, name: string) {
    if (!map) {
      return; 
    }
    map.setCenter(location); 
    const marker = new google.maps.marker.AdvancedMarkerElement(
      {
        map: map, 
        position: location, 
        title: "Marker"
      }
    )
  }

  // Infowindow library for info pop ups

  useEffect(() => {
    if (autoComplete) [
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace(); 
        setPlace(place.formatted_address as string); 
        const position = place.geometry?.location; 
        if (position) {
          setMarker(position, place.name!); 
        }
        // } else {
        //   const newPosition: google.maps.LatLng = {
        //     lat: 
        //   }
        //   setMarker(currentLocation as google.maps.LatLng, ""); 
        // }
      })
    ]
  }, [autoComplete])

  return (
    <div className="flex flex-col space-y-4">
      <input type="text" placeholder="Quest Location" ref={placesAutoCompleteRef}/>
      <label>{place}</label>
      {isLoaded ? (
        <div style={{ height: "600px" }} ref={mapRef} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
