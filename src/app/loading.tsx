"use client"; 

import Spinner from "../components/Spinner";

export default function Loading() {
  return (
    <div className="absolute p-4 text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-theme-green font-bold text-3xl">Loading...</h1>
        <p className="text-theme-green">Hopefully for not too long</p>
        <Spinner />
      </div>
    </div>
  );
}
