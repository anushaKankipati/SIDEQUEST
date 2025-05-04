import { formatDate } from "@/libs/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import AdItem from "@/src/components/AdItem";
import Link from "next/link";
import prisma from "@/libs/prismadb";
import Image from "next/image";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export async function getUserById(id: string): Promise<any> {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      Quest: {
        select: {
          id: true,
          title: true,
          price: true,
          category: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5, // Show only the 5 most recent quests
      },
    },
  });

  if (!user) return null;

  return {
    ...user,
    createdAt: new Date(user.createdAt.toISOString()),
    updatedAt: new Date(user.updatedAt.toISOString()),
  };
}

export default async function ProfilePage(args: Props) {
  const params = await args.params;
  const { id } = params;

  // Validate that the ID is a valid MongoDB ObjectId
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  if (!isValidObjectId) {
    return <div className="p-8">User not found</div>;
  }

  const user = await getUserById(id);

  if (!user) {
    return <div className="p-8">User not found</div>;
  }

  const session = await getServerSession(authOptions);
  const isCurrentUser = session?.user?.email === user.email;

  return (
    <div className="flex flex-col md:flex-row absolute inset-0 top-16">
      <div className="w-full md:w-2/3 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="relative">
            <div className="flex items-start space-x-6">
              {/* Profile Image */}
              <div className="w-36 h-36 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden">
                {user.image ? (
                  <Image
                    src={user.image || "/placeholder.svg"}
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
                <h1 className="text-3xl font-bold text-gray-900 mt-1">
                  {user.name}
                </h1>
                <p className="text-gray-600 text-m mt-2">{user.email}</p>
                <p className="text-gray-500 text-s mt-4">
                  Joined: {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            {/* Edit Profile Button - Only show for current user */}
            {/* TODO: conditionally render a message button */}
            {isCurrentUser && (
              <Link
                href="/edit-profile"
                className="absolute top-0 right-0 mt-4 rounded-full hover:bg-light-hover-green text-theme-green w-11 h-11 inline-flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPencil} className="w-6 h-6" />
              </Link>
            )}
          </div>

          {/* Details Sections */}
          <div className="mt-8 space-y-6">
            {user.about && (
              <div className="p-6 bg-gray-100 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-800">About</h3>
                <p className="mt-1 text-gray-700">{user.about}</p>
              </div>
            )}

            {user.skills && user.skills.length > 0 && (
              <div className="p-6 bg-gray-100 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                <div className="flex flex-wrap mt-2">
                  {user.skills.map((skill: string, index: number) => (
                    <span key={index} className="text-sm tag mr-1 mt-1 mb-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.Certifications && (
              <div className="p-6 bg-gray-100 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-800">
                  Certifications
                </h3>
                <p className="mt-1 text-gray-700">{user.Certifications}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Quests Section */}
      <div className="w-full md:w-1/3 p-8 bg-gray-50 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Recent Quests Posted</h2>
        {user.Quest && user.Quest.length > 0 ? (
          <div className="space-y-0">
            {user.Quest.map((quest: any) => (
              <Link href={`/ad/${quest.id}`} key={quest.id}>
                <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4">
                  <h3 className="font-semibold text-theme-green">
                    {quest.title}
                  </h3>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>
                      {quest.category === "hourly"
                        ? `$${quest.price}/hr`
                        : `$${quest.price} (fixed)`}
                    </span>
                    <span>
                      {new Date(quest.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No quests posted yet.</p>
        )}
      </div>
    </div>
  );
}
