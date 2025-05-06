"use client";

import { User } from "@prisma/client";
import DeleteConversationButton from "./DeleteConversationButton";
import Avatar from "@/src/components/Avatar";
import Link from "next/link";

interface SettingsModalProps {
  otherUsers: User[];
}

export default function SettingsModal({ otherUsers }: SettingsModalProps) {
  const firstUser = otherUsers[0];
  return (
    <>
      <div className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md border p-4">
        <div className="flex flex-col space-y-2 items-center p-4">
          <h2 className="">Conversation Settings</h2>
          <Avatar user={firstUser} />
          <h3>{firstUser.name}</h3>
          <div className="flex flex-col items-center space-y-2">
            <Link
              href={`/profile/${firstUser.id}`}
              className="
              border 
              border-theme-green
              text-theme-green
              rounded-md
              inline-flex
              gap-1
              items-center
              py-1
              px-2
              w-full
            "
            >
              View Profile
            </Link>
            <DeleteConversationButton/>
          </div>
        </div>
      </div>
    </>
  );
}
