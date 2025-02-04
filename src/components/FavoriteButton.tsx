import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FavoriteButton() {
  return (
    <FontAwesomeIcon
      icon={faHeart}
      className="fa-xl p-1.5 bg-gray-200 rounded-[50%] hover:bg-green-400 hover:color-green"
    />
  );
}
