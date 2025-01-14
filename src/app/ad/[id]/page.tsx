"use server";

import Gallery from "@/src/components/Gallery";
import LocationMap from "@/src/components/LocationMap";
import { connect, formatDate, formatMoney } from "@/libs/helpers";
import { AdModel } from "@/src/models/Ad";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import DeleteButton from "@/src/components/DeleteButton";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export default async function SingleAdPage(args: Props) {
  await connect();
  const session = await getServerSession(authOptions);
  const { id } = await args.params;
  const adDoc = await AdModel.findById(id);
  if (!adDoc) {
    return "Not Found";
  }
  return (
    <div className="flex absolute inset-0 top-16">
      <div className="w-3/5 grow bg-black text-white flex flex-col relative">
        <Gallery files={adDoc.files} />
      </div>

      <div className="w-2/5 p-8 grow shrink-0 overflow-y-scroll">
        <h1 className="text-2xl font-bold">{adDoc.title}</h1>
        {session && session?.user?.email === adDoc.userEmail && (
          <div className="mt-2 flex gap-2">
            <Link
              href={`/edit/${adDoc._id.toString()}`}
              className="border border-theme-green text-theme-green rounded-md py-1 px-4 inline-flex gap-1 items-center"
            >
              <FontAwesomeIcon icon={faPencil} />
              <span>Edit</span>
            </Link>
            <DeleteButton id={adDoc._id.toString()} />
          </div>
        )}
        <label>
          {adDoc.isPayingByHour ? "Hourly Rate" : "Price Upon Completion"}
        </label>
        <p>
          {formatMoney(adDoc.price)}
          {adDoc.isPayingByHour && "/hr"}
        </p>
        <label>Category</label>
        <p>{adDoc.category}</p>
        <label>description</label>
        <p className="text-sm">{adDoc.description}</p>
        <label>Quest Tags</label>
        {adDoc?.tags.length > 0 ? (
          <div className="flex">
            {adDoc.tags.map((tag, index) => (
              <span key={index} className="text-sm tag mx-1">
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
        <label>Location</label>
        <LocationMap className="w-full h-64" location={adDoc.location} />
        <p className="mt-8 text-sm grey-400">
          Posted: {formatDate(adDoc.createdAt)}
          <br />
          Last Update: {formatDate(adDoc.updatedAt)}
        </p>
      </div>
    </div>
  );
}
