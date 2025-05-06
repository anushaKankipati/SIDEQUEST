"use client";
import Link from "next/link";
import useRoutes from "../hooks/useRoute";
import DesktopItem from "./sidebar/DesktopItem";
import TextLogo from "./TextLogo";

export default function PrimaryLeftHeader() {
  const routes = useRoutes();
  return (
    <div className="hidden xs:flex justify-between items-center space-x-2">
      <Link href="/">
        <TextLogo />
      </Link>
      <ul className="flex justify-evenly items-center list-none space-x-1">
        {routes.map((item) => (
          <DesktopItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={item.active}
          />
        ))}
      </ul>
    </div>
  );
}
