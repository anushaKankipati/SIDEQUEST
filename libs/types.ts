import { Location } from "@/src/components/LocationPicker";

export type FormattedAutocompleteLocation = {
  formatted_address: string;
  name: string;
  location: Location; 
  vicinity: string; 
  place_id: string;
}