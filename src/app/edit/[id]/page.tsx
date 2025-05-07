"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/utils/authOptions";
import AdForm from "@/src/components/AdForm";
import { getQuestById } from "../../ad/[id]/page";

export default async function EditPage(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string>>;
  }
) {
  // pull out your dynamic route param
  const { id } = await params;
  // (if you needed query-string values, you could do:)
  // const qs = await searchParams

  const session = await getServerSession(authOptions);
  const adDoc = await getQuestById(id);

  if (!adDoc) {
    return "404 Not Found";
  }
  if (session?.user?.email !== adDoc.userEmail) {
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
