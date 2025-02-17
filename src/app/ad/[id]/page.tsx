"use server";

import Gallery from "@/src/components/Gallery";
import LocationMap from "@/src/components/LocationMap";
import { connect, formatDate, formatMoney } from "@/libs/helpers";
import { Ad, AdModel } from "@/src/models/Ad";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import DeleteButton from "@/src/components/DeleteButton";
import prisma from "@/libs/prismadb";


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
        select: { email: true },
      },
    },
  });
  console.log(quest);
  return {
    ...quest,
    createdAt: new Date(quest?.createdAt.toISOString() as string),
    updatedAt: new Date(quest?.updatedAt.toISOString() as string),
    userEmail: quest?.user.email,
  };
}

export default async function SingleAdPage(args: Props) {
  await connect();
  const session = await getServerSession(authOptions);
  const { id } = await args.params;
  const adDoc = await getQuestById(id);
  const isHourlyRateQuest = adDoc?.category === "hourly";
  if (!adDoc) {
    return "Not Found";
  }
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
