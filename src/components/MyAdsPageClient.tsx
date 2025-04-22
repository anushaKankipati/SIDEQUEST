"use client";

import AdItem from "@/src/components/AdItem";
import { useState } from "react";

export default function MyAdsPageClient({
  ads,
  userEmail,
}: {
  ads: any[];
  userEmail: string;
}) {
  const [favorites, setFavorites] = useState(
    ads.filter((ad) => ad.isFavorited).map((ad) => ad.id)
  );

  const handleFavoriteChange = (adId: string, isFavorited: boolean) => {
    // Update the favorites state based on the FavoriteButton's actions
    setFavorites((prevFavorites) =>
      isFavorited
        ? [...prevFavorites, adId] // Add to favorites
        : prevFavorites.filter((id) => id !== adId) // Remove from favorites
    );
  };

  if (ads.length === 0) {
    return <h1>No Ads Found</h1>;
  }

  return (
    <div className="container mb-6 my-12 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center pt-10">Quests You've Posted</h1>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
        {ads.map((ad) => (
          <AdItem
            key={ad.id}
            ad={ad}
            favorites={favorites}
            userEmail={userEmail}
            onFavoriteChange={handleFavoriteChange} // Pass the simplified callback
          />
        ))}
      </div>
    </div>
  );
}