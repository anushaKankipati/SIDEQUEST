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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 relative">
      <div className="absolute top-4 right-4">
        <MessageButton userId={user.id} />
      </div>
      
      <Link href={`/profile/${user.id}`}>
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={user.image || "/images/defaultavatar.jpg"}
              alt={user.name || "User profile"}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">Joined {formatDate(user.createdAt)}</p>
          </div>
        </div>
        
        {user.about && (
          <p className="mt-4 text-gray-600 line-clamp-2">{user.about}</p>
        )}
        
        {user.skills && user.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {user.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                +{user.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </Link>
    </div>
  );
} 