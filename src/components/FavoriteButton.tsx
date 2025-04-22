import { useState, useEffect } from "react";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FavoriteButton({
  userEmail,
  adId,
  isFavorited: initialIsFavorited,
  onFavoriteChange,
}: {
  userEmail: string | null;
  adId: string;
  isFavorited: boolean;
  onFavoriteChange?: (isFavorited: boolean) => void;
}) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  useEffect(() => {
    setIsFavorited(initialIsFavorited); // Sync state with prop
  }, [initialIsFavorited]);

  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState); // Optimistically update the UI

    try {
      const url = newFavoriteState
        ? "/api/favorites/add"
        : "/api/favorites/remove";
      const method = newFavoriteState ? "POST" : "DELETE";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, adId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite state");
      }

      //const responseData = await response.json();

      // Confirm the state with the server's response
      setIsFavorited(newFavoriteState);

      // Notify the parent component of the change
      if (onFavoriteChange) {
        onFavoriteChange(newFavoriteState);
      }
    } catch (error) {
      console.error("Failed to update favorite state:", error);
      setIsFavorited(!newFavoriteState); // Revert UI if the request fails
    }
  };

  return (
    <FontAwesomeIcon
      icon={isFavorited ? solidHeart : regularHeart}
      className={`fa-xl p-1.5 rounded-[50%] ${
        isFavorited ? "text-red-500 bg-gray-200" : "bg-gray-200 hover:bg-green-300"
      }`}
      onClick={handleFavoriteToggle}
    />
  );
}
