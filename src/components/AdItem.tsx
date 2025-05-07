"use client";

import { formatMoney, formatLongText, getDistanceInMiles } from "@/libs/helpers";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { Ad } from "../models/Ad";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { Location } from "./LocationPicker";


export default function AdItem({ad,favorites,userEmail,onFavoriteChange}:{ad:Ad; favorites:string[]; userEmail:string|null;onFavoriteChange:(adId:string,isFavorited:boolean)=>void;}){
    const isHourlyRateQuest = ad.category === "hourly";
    const currentLocation = useCurrentLocation  (state => state.currLocation);
    
    return (
      
        <Link
          href={`/ad/${ad.id}`}
          className="p-4 bg-gray-100 rounded-2xl min-h-24 flex flex-col justify-start hover:scale-[101%] hover:bg-light-hover-green"
        >
          <div className="p-2">
            <div className="flex justify-between align-top">
              <div className="flex flex-col">
                <h1 className="text-2xl">{ad.title}</h1>
                {ad.formattedLocation?.vicinity && (
                  <div>
                    {ad.formattedLocation?.vicinity} - {getDistanceInMiles(currentLocation as Location, ad.formattedLocation.location)} Miles From You
                  </div>
                )}
              </div>
              <div className="flex align-top">
                <div className="flex flex-col mr-6 align-bottom">
                  <p className="">
                    {isHourlyRateQuest ? "Hourly Rate " : "Fixed Rate "}
                  </p>
                  <span className="font-bold ml-auto">
                    {isHourlyRateQuest
                      ? formatMoney(ad.price) + "/hr"
                      : formatMoney(ad.price)}
                  </span>
                </div>
                <FavoriteButton adId={ad.id} userEmail={userEmail} isFavorited = {favorites?.includes(ad.id)} onFavoriteChange={(isFavorited)=> onFavoriteChange(ad.id, isFavorited)}/>
              </div>
            </div>
            <p className="mt-3 mb-3">
              {ad.description.length > 400
                ? formatLongText(ad.description)
                : ad.description}
            </p>
            <label>Quest Tags</label>
            {ad?.tags.length > 0 ? (
              <div className="flex flex-wrap">
                {ad.tags.map((tag, index) => (
                  <span key={index} className="text-sm tag mr-1 mt-1 mb-1">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm">No Tags Found for this Quest</p>
            )}
          </div>
        </Link>
    );
}
