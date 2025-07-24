"use client";
import { useEffect, useState } from "react";
import { Ad } from "../models/Ad";
import AdItem from "../components/AdItem";
import SearchForm from "../components/SearchForm";
import { defaultRadius, toTitleCase } from "../../libs/helpers";
import { getSession } from "next-auth/react";
import { FaSearchDollar } from "react-icons/fa";
import MobileSearchBar from "./MobileSearchBar";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function HomeAdsView() {
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [adsParams, setAdsParams] = useState<URLSearchParams | null>(
    new URLSearchParams()
  );
  const [mobileSidebarOpen, setMobileSideBarOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]); // Ensure favorites is initialized as an empty array
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } //maybe initialize setFavorites if not successful
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userEmail) return;
      try {
        const response = await fetch(`/api/favorites?userEmail=${userEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Failed to fetch favorites:",
            errorData.message || response.statusText
          );
          throw new Error(errorData.message || "Failed to fetch favorites");
        }
        const data = await response.json();
        setFavorites(data.favoriteIds || []); // Initialize the favorites state with fetched data or an empty array
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        setFavorites([]); // Fallback to an empty array in case of an error
      }
    };

    fetchFavorites();
  }, [userEmail]);

  const handleFavoriteChange = async (adId: string, isFavorited: boolean) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites) return []; // Ensure prevFavorites is always defined
      if (isFavorited) {
        return prevFavorites.filter((id) => id !== adId);
      } else {
        return [...prevFavorites, adId];
      }
    });
  };

  useEffect(() => {
    fetchAds();
  }, []);

  function fetchAds(params?: URLSearchParams) {
    if (!params) {
      return;
    }
    if (!params.has("radius")) {
      params.set("radius", defaultRadius.toString());
    }
    const url = `/api/ads?${params?.toString() || ""}`;
    fetch(url)
      .then((response) => response.json())
      .then((adsDocs) => {
        setAds(adsDocs);
        setAdsParams(params);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleSearch(formData: FormData) {
    if (!formData.has("center")) {
      return;
    }

    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        params.set(key, value);
      }
    });
    fetchAds(params);
    if (mobileSidebarOpen) {
      setMobileSideBarOpen(false); 
    }
  }
  const tagDirty = adsParams?.get("input_tags");
  const formDirty =
    adsParams?.get("phrase") ||
    adsParams?.get("category") ||
    adsParams?.get("min") ||
    adsParams?.get("max");
  return (
    <div className="flex w-full h-screen">
      <SearchForm onSearch={handleSearch} />
      <MobileSearchBar onSearch={handleSearch} isOpen={mobileSidebarOpen} setIsOpen={setMobileSideBarOpen}/>
      <div className="p-4 grow md:w-3/5 overflow-y-auto mt-16">
        <div className="flex items-center">
          <div
            className="
              flex 
              items-center
              p-2
              hover:bg-green-100
              rounded-lg
              md:hidden
              cursor-pointer
            "
            onClick={() => setMobileSideBarOpen((prev) => !prev)}
          >
            <FaSearchDollar className="text-theme-green" size={30} />
            <p className="text-theme-green font-medium">Search for Quests</p>
          </div>
        </div>
        <h2 className="font-bold mt-2 mb-4">
          {tagDirty
            ? "Search Results for Selected Tags"
            : formDirty
            ? "Search Results for " + toTitleCase(formDirty.toString())
            : "Latest Quests"}
        </h2>
        <div className="flex flex-col gap-6 pr-7 2xl:grid 2xl:grid-cols-2">
          {ads &&
            ads.map((ad) => (
              <div key={ad.id} className="w-full">
                <AdItem
                  key={ad.id}
                  ad={ad}
                  favorites={favorites}
                  userEmail={userEmail} //userEmail of user that is currently logged in
                  onFavoriteChange={(adId, isFavorited) =>
                    handleFavoriteChange(adId, isFavorited)
                  }
                />
              </div>
            ))}
        </div>
        {ads && ads?.length === 0 && (
          <div className="text-gray-400">No Quests Found</div>
        )}
        {ads === null && <div className="text-gray-400">Loading...</div>}
      </div>
    </div>
  );
}
