import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import useGoogleMapsLoader from "../hooks/useGoogleMapsLoader";
import { Location } from "./LocationPicker";

interface PlacesAutoCompleteProps {
  location?: Location; 
  onChange: (location: Location) => void; 
}

const PlacesAutoComplete = ({location, onChange} : PlacesAutoCompleteProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "PlacesAutoComplete",
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: any) =>
    () => {
      // When the user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        const newLocation: Location = {lng: lng, lat: lat}
        onChange(newLocation); 
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <input
      type="text"
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Address"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not. "OK" denotes a successful API call*/}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

const ReadyComponent = ({location, onChange}: PlacesAutoCompleteProps) => {
  const isLoaded = useGoogleMapsLoader(); 
  if (!isLoaded) {
    return <div>Loading Google Maps Location Autocomplete...</div>
  }
  return <PlacesAutoComplete location={location} onChange={onChange}/>
}

export default ReadyComponent; 