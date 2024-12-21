"use server";

import { connect } from "../../../libs/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { AdModel } from "@/src/models/Ad";
import AdForm from "@/src/components/AdForm";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export default async function EditPage(props: Props) {
  const id = props.params.id;
  await connect();
  const session = await getServerSession(authOptions);
  const adDoc = await AdModel.findById(id);
  if (!adDoc) {
    return "404 Not Found";
  }
  if (session?.user?.email !== adDoc?.userEmail) {
    return "not yours";
  }

  return (
    <AdForm
      id={adDoc._id}
      defaultTexts={adDoc}
      defaultFiles={adDoc.files}
      defaultLocation={adDoc.location}
    />
  );
}
