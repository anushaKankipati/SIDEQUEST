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
import { getSession } from "next-auth/react";


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
          profile_image: true,
          name: true,
        },
      },
    },
  });
  return {
    ...quest,
    createdAt: new Date(quest?.createdAt.toISOString() as string),
    updatedAt: new Date(quest?.updatedAt.toISOString() as string),
    userEmail: quest?.user.email,
  };
}


export default async function SingleAdPage(args: Props) {
  const { id } = args.params
  const adDoc = await getQuestById(id)

  if (!adDoc) {
    return "Not Found"
  }
  const session = await getServerSession(authOptions)
  const isHourlyRateQuest = adDoc?.category === "hourly"
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
          <div className="flex items-center space-x-1">
          <p className="font-semibold">Posted by</p>
          <Link href={`/profile/${adDoc.user.id}`} className="font-semibold hover:underline">
            {adDoc.user.name}
          </Link>
          
            {adDoc.user.profile_image && (
              <Image
                src={adDoc.user.profile_image || "/placeholder.svg"}
                alt={`${adDoc.user.name}'s profile`}
                width={30}
                height={30}
                className="rounded-full"
              />
            )}
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
        <p className="mt-8 text-sm grey-400">
          Posted: {formatDate(adDoc.createdAt)}
          <br />
          Last Update: {formatDate(adDoc.updatedAt)}
        </p>
        <label>{isHourlyRateQuest ? "Hourly Rate" : "Price Upon Completion"}</label>
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
  )
}
