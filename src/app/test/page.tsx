import { FormattedAutocompleteLocation } from "@/libs/types";
import AutoCompleteMap from "@/src/components/AutoCompleteMap";
import { useState } from "react";

export default function TestPage() {
  const [location, setLocation] = useState<FormattedAutocompleteLocation | null>(null);
  return <AutoCompleteMap onLocationChange={(location) => setLocation(location)}/>
}