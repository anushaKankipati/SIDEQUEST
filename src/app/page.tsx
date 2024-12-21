"use client";
import { useEffect, useState } from "react";
import { Ad } from "../models/Ad";
import AdItem from "../components/AdItem";
import SearchForm from "../components/SearchForm";
import { error } from "console";
import { defaultRadius } from "../libs/helpers";

export default function Home() {
  const [ads, setAds] = useState<Ad[]|null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  function fetchAds(params?: URLSearchParams) {
    if(!params){
      params = new URLSearchParams();
    }
    if(!params.has('radius')){
      params.set('radius', defaultRadius.toString());
    }
    const url = `/api/ads?${params?.toString() || ""}`;
    fetch(url)
      .then(response => response.json())
      .then(adsDocs => {
        setAds(adsDocs);
      })
      .catch(err => {
        console.error(err);
      });
  }

  function handleSearch(formData: FormData) {
    if (!formData.has("center") ){
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
  return (
    <div className="flex w-full">
      <SearchForm onSearch={handleSearch} />
      <div className="p-4 grow bg-gray-100 w-3/4">
        <h2 className="font-bold mt-2 mb-4">Latest Tasks</h2>
        <div className="grid md:grid-cols-4 gap-x-4 gap-y-6">
          {ads && ads.map((ad) => (
            <AdItem key={ad._id} ad={ad} />
          ))}
        </div>
        {ads && ads?.length === 0 && (
          <div className="text-gray-400">No Products Found</div>
        )}
        {ads === null && (
          <div className="text-gray-400">Loading...</div>
        )}
      </div>
    </div>
  );
}
