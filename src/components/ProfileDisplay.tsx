import type { User } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

interface ProfileDisplayProps {
  user: User;
}

export default function ProfileDisplay({ user }: ProfileDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-14">
      {/* Profile Header */}
      <div className="relative">
        <div className="flex items-start space-x-6">
            {/* Profile Image */}
            <div className="w-36 h-36 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden">
            {user.profile_image ? (
                <Image
                  src={user.profile_image}
                  alt={`${user.name}'s profile picture`}
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500">
                No Image
                </div>
            )}
            </div>

            {/* Name, Email, CreatedAt */}
            <div>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{user.name}</h1>
            <p className="text-gray-600 text-m mt-2">{user.email}</p>
            <p className="text-gray-500 text-s mt-4">Joined: {new Date(user.createdAt).toLocaleDateString()} </p>
            </div>
        </div>

        {/* Edit Profile Button */}
        <Link
            href="/edit-profile"
            className="absolute top-0 right-0 mt-4 rounded-full hover:bg-light-hover-green text-theme-green w-11 h-11 inline-flex items-center justify-center"
            >
            <FontAwesomeIcon icon={faPencil} className="w-6 h-6" />
        </Link>
        </div>


      {/* Details Sections */}
      <div className="mt-8 space-y-6">
        {user.about && (
          <div className="p-6 bg-gray-100  rounded-2xl ">
            <h3 className="text-lg font-semibold text-gray-800">About</h3>
            <p className="mt-1 text-gray-700">{user.about}</p>
          </div>
        )}

        {user.skills && user.skills.length > 0 && (
          <div className="p-6 bg-gray-100 rounded-2xl ">
            <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
            <div className="flex flex-wrap mt-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-sm tag mr-1 mt-1 mb-1 "
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {user.Certifications && (
          <div className="p-6 bg-gray-100 rounded-2xl ">
            <h3 className="text-lg font-semibold text-gray-800">Certifications</h3>
            <p className="mt-1 text-gray-700">{user.Certifications}</p>
          </div>
        )}
      </div>
    </div>
  );
}
