"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TextLogo from "./TextLogo";
import { Redirect } from "next";

export default function Header({ session }: { session: Session | null }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b p-4 flex items-center justify-between h-16 bg-white">
      <Link href="/">
        <TextLogo />
      </Link>
      <nav className="items-center flex gap-4 *:rounded">
        {session?.user && (
          <Link
            href="/new"
            className="border h-full border-theme-green text-theme-green inline-flex gap-1 items-center px-2 mr-4 py-2"
          >
            <FontAwesomeIcon icon={faPlus} className="h-4" />
            <span>Post a Quest</span>
          </Link>
        )}
        <span className="border-r"></span>
        {!session?.user && (
          <>
            <button
              onClick={() => signIn("google")}
              className="bg-theme-green text-white h-full text-theme-green inline-flex gap-1 items-center px-2 py-2"
            >
              Login/Sign Up to Post Tasks
            </button>
          </>
        )}
        {session?.user && (
          <>
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                title="profile-button"
              >
                <Image
                  className={"rounded-md" + (showDropdown ? "z-50" : "")}
                  src={session.user.image as string}
                  alt={"avatar"}
                  width={36}
                  height={36}
                />
              </button>
              {showDropdown && (
                <>
                  <div
                    onClick={() => setShowDropdown(false)}
                    className="bg-black/50 fixed inset-0 z-40"
                  ></div>
                  <div className="absolute z-50 right-0 top-8 bg-white rounded-md w-24 border">
                    <button
                      className="p-2 block text-center cursor-pointer w-full"
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/my-ads");
                      }}
                    >
                      My Quests
                    </button>
                    <button
                      className="p-2 block text-center cursor-pointer w-full"
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/my-profile");
                      }}
                    >
                      My Profile
                    </button>
                    <button
                      className="p-2 block w-full cursor-pointer"
                      onClick={async () => {
                        await signOut({ callbackUrl: "/" });
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
