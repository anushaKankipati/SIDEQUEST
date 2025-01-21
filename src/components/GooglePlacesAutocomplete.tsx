import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import useGoogleMapsApi from "../hooks/useGoogleMapsApi";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { Location } from "./LocationPicker";

interface PlacesAutoCompleteProps {
  location?: Location; 
  setLocation: (newLocation: Location) => void; 
}

const PlacesAutoComplete = ({location, setLocation} : PlacesAutoCompleteProps) => {
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
        setLocation(newLocation); 
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

const ReadyComponent = ({location, setLocation}: PlacesAutoCompleteProps) => {
  const [loading] = useGoogleMapsApi({library: "places"}); 
  if (loading) {
    return <div>Loading Google Maps Location Autocomplete...</div>
  }
  return <PlacesAutoComplete location={location} setLocation={setLocation}/>
}

export default ReadyComponent; 