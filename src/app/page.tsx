'use client';

import { useEffect, useRef, useState } from "react";
import { Ad } from "../models/Ad";
import AdItem from "../components/AdItem";
import { categories } from "../libs/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  function fetchAds(params?: URLSearchParams) {
    const url = `/api/ads?${params?.toString() || ''}`;
    fetch(url).then(response => {
      response.json().then(adsDocs => {
        setAds(adsDocs);
      })
    });
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        params.set(key, value);
      }
    });
    fetchAds(params);
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    const formData = new FormData(formRef.current!);
    formData.set('category', category);
    const params = new URLSearchParams(formData as any);
    fetchAds(params);
  }

  return (
    <div className="flex w-full">
      <form 
        ref={formRef}
        onSubmit={handleSearch}
        className="bg-white grow w-1/4 p-4 border-r flex flex-col gap-4"
      >
        <input name="phrase" type="text" placeholder="Search SIDEQUE$T..." />
        <div className="flex flex-col gap-0">
          <label className={`radio-btn group ${selectedCategory === "" ? 'bg-blue-100' : ''}`}>
            <input 
              onClick={() => handleCategoryChange("")} 
              className="hidden" 
              type="radio" 
              name="category" 
              value="" 
              checked={selectedCategory === ""}
              onChange={() => {}}
            />
            <span className="icon group-has-[:checked]:bg-blue-500 group-has-[:checked]:text-white">
              <FontAwesomeIcon icon={faStore}/>
            </span>
            All Categories
          </label>
          {categories.map(({key, label, icon}) => (
            <label key={key} className={`radio-btn group ${selectedCategory === key ? 'bg-blue-100' : ''}`}>
              <input 
                onClick={() => handleCategoryChange(key)} 
                className="hidden" 
                type="radio" 
                name="category" 
                value={key}
                checked={selectedCategory === key}
                onChange={() => {}}
              />
              <span className="icon group-has-[:checked]:bg-blue-500 group-has-[:checked]:text-white">
                <FontAwesomeIcon icon={icon}/>
              </span>
              {label}
            </label>
          ))}
        </div>
      </form>
      <div className="p-4 grow bg-gray-100 w-3/4">
        <h2 className="font-bold mt-2 mb-4">Latest Tasks</h2>
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {ads.map(ad => (
            <AdItem key={ad._id} ad={ad}/>
          ))}
        </div>
      </div>
    </div>
  );
}

