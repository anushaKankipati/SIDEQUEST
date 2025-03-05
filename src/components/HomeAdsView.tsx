"use client";
import { useEffect, useState } from "react";
import { Ad } from "../models/Ad";
import AdItem from "../components/AdItem";
import SearchForm from "../components/SearchForm";
import { defaultRadius, toTitleCase } from "../../libs/helpers";

export default function HomeAdsView() {
  const [ads, setAds] = useState<Ad[] | null>(null);
  const [adsParams, setAdsParams] = useState<URLSearchParams | null>(
    new URLSearchParams()
  );

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
  }
  const tagDirty =
    adsParams?.get("input_tags");
  const formDirty =
    adsParams?.get("phrase") ||
    adsParams?.get("category") ||
    adsParams?.get("min") ||
    adsParams?.get("max");
  return (
    <div className="flex w-full h-screen">
      <SearchForm onSearch={handleSearch} />
      <div className="p-4 grow w-3/5 overflow-y-auto mt-16">
        <h2 className="font-bold mt-2 mb-4">
          {tagDirty
            ? ("Search Results for Selected Tags")
            : formDirty
            ? "Search Results for " + toTitleCase(formDirty.toString())
            : "Latest Quests"}
        </h2>
        <div className="flex flex-col gap-6 pr-7 2xl:grid 2xl:grid-cols-2">
          {ads &&
            ads.map((ad) => (
              <div key={ad.id} className="w-full">
                <AdItem ad={ad} />
              </div>
            ))}
        </div>
        {ads && ads?.length === 0 && (
          <div className="text-gray-400">No Products Found</div>
        )}
        {ads === null && <div className="text-gray-400">Loading...</div>}
      </div>
    </div>
  );
}
