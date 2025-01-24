import { formatMoney, formatLongText } from "@/libs/helpers";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { Ad } from "../models/Ad";

export default function AdItem({ ad }: { ad: Ad }) {
  return (
    <Link
      href={`/ad/${ad._id}`}
      className="p-4 bg-gray-100 rounded-2xl min-h-24 flex flex-col justify-start"
    >
      <div className="p-2">
        <div className="flex justify-between align-top">
          <div className="flex flex-col">
            <h1 className="text-2xl">{ad.title}</h1>
            {ad?.cityName && (
              <div>
                {ad?.cityName} {"- _ miles from you"}
              </div>
            )}
          </div>
          <div className="flex align-top">
            <div className="flex flex-col mr-6 align-bottom">
              <p className="">
                {ad.isPayingByHour ? "Hourly Rate " : "Fixed Rate "}
              </p>
              <span className="font-bold ml-auto">
                {ad.isPayingByHour
                  ? formatMoney(ad.price) + "/hr"
                  : formatMoney(ad.price)}
              </span>
            </div>
            <FavoriteButton />
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
