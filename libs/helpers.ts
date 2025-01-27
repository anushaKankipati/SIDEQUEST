import {
  faCar,
  faHome,
  faMobile,
  faTshirt,
} from "@fortawesome/free-solid-svg-icons";
import mongoose from "mongoose";

export async function connect() {
  mongoose.connect(process.env.MONGODB_URL as string);
}

// export type QuestAddress = {
//   address: string; 
//   cityName: string; 
//   state: string; 
//   country: string; 
//   location: Location; 
// }

// geocode api request 
// https://maps.googleapis.com/maps/api/geocode/json?latlng=37.3489,-121.9368&key=GOOGLE_MAPS_API_KEY

export const categories = [
  { key: "cars", label: "Cars", icon: faCar },
  { key: "electronics", label: "Electronics", icon: faMobile },
  { key: "clothes", label: "Clothes", icon: faTshirt },
  { key: "properties", label: "Properties", icon: faHome },
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

export function extractCityName(text: string): string {
  return text.slice(0, text.indexOf(","));
}