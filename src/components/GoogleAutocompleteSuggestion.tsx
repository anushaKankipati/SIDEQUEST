import { faLocationDot, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface GoogleAutocompleteSuggestionProps {
  uniqueKey: string;
  onClick: () => void;
  mainText: string;
  secondaryText: string;
}

export default function GoogleAutocompleteSuggestion({
  uniqueKey,
  onClick,
  mainText,
  secondaryText,
}: GoogleAutocompleteSuggestionProps) {
  return (
    <li key={uniqueKey} onClick={onClick} className="p-1 flex items-center flex-nowrap">
      <FontAwesomeIcon icon={faLocationDot} className="fa-light ml-1 mr-3 " color="green"/>
      <p className="text-black flex flex-nowrap">{mainText + " "}</p>
      <p className="text-gray-600 flex flex-nowrap">{"\u00A0" + secondaryText}</p>
    </li>
  );
}
