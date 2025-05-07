"use server";

import Gallery from "@/src/components/Gallery";
import LocationMap from "@/src/components/LocationMap";
import { formatDate, formatMoney } from "@/libs/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import DeleteButton from "@/src/components/DeleteButton";
import prisma from "@/libs/prismadb";
import Image from "next/image";
import MessageButton from "@/src/components/MessageButton";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export async function getQuestById(id: string): Promise<any> {
  const quest = await prisma.quest.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          image: true,
          name: true,
        },
      },
    },
  });
  return {
    ...quest,
    createdAt: new Date(quest?.createdAt.toISOString() as string),
    updatedAt: new Date(quest?.updatedAt.toISOString() as string),
    userEmail: quest?.user.email
  };
}

async function getRecommendedUsers(questTags: string[], questOwnerEmail: string): Promise<any[]> {
  const users = await prisma.user.findMany({
    where: {
      skills: {
        hasSome: questTags
      },
      // Exclude the quest owner
      NOT: {
        email: questOwnerEmail
      }
    },
    select: {
      id: true,
      name: true,
      image: true,
      skills: true,
      email: true,
    },
    take: 5, // Limit to 5 recommendations
  });

  // Sort users by number of matching skills
  return users.sort((a, b) => {
    const aMatches = a.skills.filter((skill: string) => questTags.includes(skill)).length;
    const bMatches = b.skills.filter((skill: string) => questTags.includes(skill)).length;
    return bMatches - aMatches;
  });
}

export default async function SingleAdPage(args: Props) {
  const params = await args.params;
  const { id } = params;
  const adDoc = await getQuestById(id);

  if (!adDoc) {
    return "Not Found";
  }
  const session = await getServerSession(authOptions);
  const isHourlyRateQuest = adDoc?.category === "hourly";
  const isCurrentUser = session?.user?.email === adDoc.userEmail;

  // Get recommended users if this is the current user's quest
  const recommendedUsers = isCurrentUser ? await getRecommendedUsers(adDoc.tags, adDoc.userEmail) : [];

  return (
    <div className="flex absolute inset-0 top-16">
      <div className="w-1/2 grow flex flex-col relative">
        {adDoc.files && adDoc.files.length > 0 ? (
          <div className="h-full bg-black text-white flex flex-col relative">
            <Gallery files={adDoc.files} />
          </div>
        ) : (
          <LocationMap className="w-full h-full" location={adDoc.location} />
        )}
      </div>

      <div className="w-1/2 p-8 grow shrink-0 overflow-y-scroll">
        <h1 className="text-2xl font-bold">{adDoc.title}</h1>

        {/* User Information */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <p className="font-semibold">Posted by</p>
            <Link
              href={`/profile/${adDoc.user.id}`}
              className="font-semibold hover:underline"
            >
              {adDoc.user.name}
            </Link>

            <div className="flex items-center space-x-2">
              {adDoc.user.image && (
                <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden">
                  <Image
                    src={adDoc.user.image || "/placeholder.svg"}
                    alt={`${adDoc.user.name}'s profile`}
                    fill
                    className="object-cover"
                    sizes="30px"
                  />
                </div>
              )}
              {!isCurrentUser && session && (
                <div className="ml-1">
                  <MessageButton userId={adDoc.user.id} />
                </div>
              )}
            </div>
          </div>
        </div>

        {session && session?.user?.email === adDoc.userEmail && (
          <div className="mt-2 flex gap-2">
            <Link
              href={`/edit/${adDoc.id.toString()}`}
              className="border border-theme-green text-theme-green rounded-md py-1 px-4 inline-flex gap-1 items-center"
            >
              <FontAwesomeIcon icon={faPencil} />
              <span>Edit</span>
            </Link>
            <DeleteButton id={adDoc.id.toString()} />
          </div>
        )}

        {/* Recommended Users Section */}
        {isCurrentUser && recommendedUsers.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recommended Questers</h2>
              <span className="text-sm text-gray-500">{recommendedUsers.length} matches found</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {recommendedUsers.map((user) => (
                <div key={user.id} className="relative flex-none w-[280px]">
                  <Link
                    href={`/profile/${user.id}`}
                    className="block bg-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                              <Image
                                src={user.image || "/images/defaultavatar.jpg"}
                                alt={`${user.name}'s profile`}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <div className="text-base font-medium text-gray-900 group-hover:text-theme-green transition-colors">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.skills.filter((skill: string) => adDoc.tags.includes(skill)).length} matching skills
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {user.skills
                            .filter((skill: string) => adDoc.tags.includes(skill))
                            .map((skill: string, index: number) => (
                              <span 
                                key={index} 
                                className="text-xs tag"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4 z-10">
                    <MessageButton userId={user.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-8 text-sm grey-400">
          Posted: {formatDate(adDoc.createdAt)}
          <br />
          Last Update: {formatDate(adDoc.updatedAt)}
        </p>
        <label>
          {isHourlyRateQuest ? "Hourly Rate" : "Price Upon Completion"}
        </label>
        <p>
          {formatMoney(adDoc.price)}
          {isHourlyRateQuest && "/hr"}
        </p>
        <label>description</label>
        <p className="text-sm">{adDoc.description}</p>
        <label>Quest Tags</label>
        {adDoc?.tags.length > 0 ? (
          <div className="flex flex-wrap">
            {adDoc.tags.map((tag: string, index: number) => (
              <span key={index} className="text-sm tag m-1">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm">No Tags Found for this Quest</p>
        )}
        <label>Time estimate</label>
        <p className="text-sm">{adDoc.time_estimate} hrs</p>
        <label>contact</label>
        <p>{adDoc.contact}</p>
        {adDoc.files && adDoc.files.length > 0 ? (
          <>
            <label>Location</label>
            <LocationMap className="w-full h-64" location={adDoc.location} />
          </>
        ) : null}
      </div>
      
    </div>
  );
}
