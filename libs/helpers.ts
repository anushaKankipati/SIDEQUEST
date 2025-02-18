import { Location } from "@/src/components/LocationPicker";
import { faClock, faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";
import mongoose from "mongoose";


export const categories = [
  { key: "hourly", label: "Hourly Only", icon: faClock },
  { key: "fixed", label: "Fixed Rate Only", icon: faMoneyCheckDollar },
];

export function formatMoney(amount: number): string {
  return "$" + Intl.NumberFormat("US", { currency: "USD" }).format(amount);
}

export const defaultRadius = 50 * 1000;

export function formatDate(date: Date): string {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatLongText(text: string): string {
  let idx = 399;
  while (idx < text.length && text[idx] != " ") {
    idx++;
  }
  return text.slice(0, idx) + " ...";
}

export function getDistanceInMiles(origin: Location, destination: Location) {
  // Radius of Earth in miles
  const R = 3959;
  const { lat: lat1, lng: lon1 } = origin;
  const { lat: lat2, lng: lon2 } = destination;

  // Convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  // Convert coordinates to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Differences in coordinates
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in miles
  const distance = R * c;
  return distance.toFixed(1);
}
