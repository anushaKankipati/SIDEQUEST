"use client";

import { User } from "@prisma/client";
import DeleteConversationButton from "./DeleteConversationButton";
import Avatar from "@/src/components/Avatar";

interface SettingsModalProps {
  otherUsers: User[];
}


export default function SettingsModal({otherUsers}: SettingsModalProps) {
  return (
    <>
      {/* TODO: finish this modal */}
      <div className="absolute z-50 right-[50%] top-[50%] bg-white rounded-md w-24 border p-4">
        <div className="flex flex-col space-y-2">
          <h2 className="">Settings</h2>
          <Avatar user={otherUsers[0]}/>
          <DeleteConversationButton />
        </div>
      </div>
    </>
  );
}
