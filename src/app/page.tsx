'use client';

import { useEffect, useState } from "react";
import { Ad } from "../models/Ad";
import UploadThumbnail from "../components/UploadThumbnail";
import Link from "next/link";

export default function Home() {
  const [ads, setAds] = useState<Ad[]>([]);
  useEffect(() => {
    fetch('/api/ads').then(response => {
      response.json().then(adsDocs => {
        setAds(adsDocs);
      })
    });
  }, []);
  return (
    <div className="flex w-full">
      <div className="bg-gray-300 grow w-1/4">left</div>
      <div className="p-4 grow w-3/4">
        <h2 className="font-bold mt-2 mb-4">Latest Tasks</h2>
        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
          {ads.map(ad => (
            <div key={ad._id} className="border-red-500 min-h-24 flex flex-col justify-start">
              {ad.files?.length > 0 && (
                <div className="rounded-md overflow overflow-hidden relative"> 
                  <UploadThumbnail onClick={() =>{}} file={ad.files[0]} />
                    <Link href={`/ad/${ad._id}`} className="absolute inset-0"></Link>
                </div>
              )}
              <div>
                <p className="mt-1 font-bold">${ad.price}</p>
                <Link href={`/ad/${ad._id}`}>{ad.title}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
