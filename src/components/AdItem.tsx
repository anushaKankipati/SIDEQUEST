"use client";

import Link from "next/link";
import UploadThumbnail from "./UploadThumbnail";
import { Ad } from "../models/Ad";
import { formatMoney } from "@/libs/helpers";

export default function AdItem({ad}:{ad:Ad}){
    return (
        <Link href={`/ad/${ad._id}`} className="p-4 bg-gray-100 rounded-md min-h-24 flex flex-col justify-start">
              {ad.files?.length > 0 && (
                <div className="rounded-md overflow overflow-hidden relative"> 
                  <UploadThumbnail onClick={() =>{}} file={ad.files[0]} />
                    <Link href={`/ad/${ad._id}`} className="absolute inset-0"></Link>
                </div>
              )}
              <div>
                <div className="mt-1 text-2xl">{ad.title}</div>
                <p className="">{ad.isPayingByHour ? "Hourly Rate: " : "Quest Bounty: "}<span className="font-bold">{ad.isPayingByHour ? formatMoney(ad.price) + "/hr" : formatMoney(ad.price)}</span></p>
              </div>
        </Link>
    );
}