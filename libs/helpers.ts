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
