"use server";
import Image from "next/image";

export default async function LandingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-8">
        <div className="text-center md:text-left w-1/3">
          <h1 className="text-7xl md:text-8xl font-bold text-gray-800">
            Find your <span className="text-theme-green">Quest</span> Today
          </h1>
        </div>
        <div className="flex justify-center w-2/3">
          <Image
            src={"/images/roundlogo.png"}
            alt="SideQuest Logo"
            width={600}
            height={600}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
