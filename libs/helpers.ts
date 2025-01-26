import {
  faCircleCheck, 
  faClock,
} from "@fortawesome/free-solid-svg-icons";
// import {faClock, faCircleCheck} from "@fortawesome/free-regular-svg-icons";
import mongoose from "mongoose";

export async function connect() {
  mongoose.connect(process.env.MONGODB_URL as string);
}

export const categories = [
  { key: "hourly", label: "Hourly Only", icon: faClock },
  { key: "fixed", label: "Fixed Rate Only", icon: faCircleCheck },
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
