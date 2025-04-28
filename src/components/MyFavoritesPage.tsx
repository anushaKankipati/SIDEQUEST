"use client";

import { useState } from "react";
import AdItem from "@/src/components/AdItem";

export default function MyFavoritesPage({
  initialFavorites,
  userEmail,
}: {
  initialFavorites: any[];
  userEmail: string;
}) {
  const [favoriteAds, setFavoriteAds] = useState(initialFavorites);

  const handleFavoriteChange = async (adId: string) => {
    try {
      // Optimistically update the UI by removing the ad
      setFavoriteAds(
        (prevFavorites) => prevFavorites.filter((ad) => ad.id !== adId) // Remove the ad from favorites
      );

      // Make API call to remove the favorite
      const response = await fetch("/api/favorites/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, adId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);

      // Revert UI changes if the API call fails
      setFavoriteAds((prevFavorites) => {
        const revertedAd = initialFavorites.find((ad) => ad.id === adId);
        if (revertedAd && !prevFavorites.some((ad) => ad.id === adId)) {
          return [...prevFavorites, revertedAd];
        }
        return prevFavorites;
      });
    }
  };

  return (
    <div className="container mb-6 my-12 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center pt-10">
        Your Favorite Quests
      </h1>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
        {favoriteAds.map((ad) => (
          <AdItem
            key={ad.id}
            ad={ad}
            favorites={favoriteAds.map((ad) => ad.id)}
            userEmail={userEmail}
            onFavoriteChange={() => handleFavoriteChange(ad.id)} // Only handle removal
          />
        ))}
      </div>
    </div>
  );
}
