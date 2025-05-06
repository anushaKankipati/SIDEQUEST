"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/libs/helpers";
import MessageButton from "./MessageButton";

interface UserCardProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    about: string | null;
    skills: string[] | null;
    createdAt: Date;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg relative transition-shadow p-4 h-full">
      <div className="absolute top-4 right-4">
        <MessageButton userId={user.id} />
      </div>
      
      <Link href={`/profile/${user.id}`}>
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={user.image || "/images/defaultavatar.jpg"}
              alt={user.name || "User profile"}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-gray-900 truncate">{user.name}</h2>
            <p className="text-sm text-gray-500">Joined {formatDate(user.createdAt)}</p>
          </div>
        </div>
        
        <div className="mt-4 min-h-[40px]">
          {user.about ? (
            <p className="text-gray-600 line-clamp-2">{user.about}</p>
          ) : (
            <p className="text-gray-400 italic">No description available</p>
          )}
        </div>
        
        <div className="mt-4 min-h-[32px]">
          {user.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  +{user.skills.length - 4} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">No skills listed</p>
          )}
        </div>
      </Link>
    </div>
  );
} 