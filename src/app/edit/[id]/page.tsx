"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import AdForm from "@/src/components/AdForm";
import { getQuestById } from "../../ad/[id]/page";

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string };
};

export default async function EditPage(props: Props) {
  const session = await getServerSession(authOptions);
  const {id} = await props.params;
  const adDoc = await getQuestById(id);
  if (!adDoc) {
    return "404 Not Found";
  }
  if (session?.user?.email !== adDoc?.userEmail) {
    return "not yours";
  }

  return (
    <AdForm
      id={adDoc.id.toString()}
      defaultTexts={JSON.parse(JSON.stringify(adDoc))}
      defaultFiles={adDoc.files}
      defaultLocation={adDoc.location}
      defaultTags={adDoc.tags}
      defaultFormattedLocation={adDoc.formattedLocation}
    />
  );
}
