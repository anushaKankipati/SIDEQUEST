import { Ad } from "@/src/models/Ad";
import { FilterQuery } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/utils/authOptions";
import prisma from "@/libs/prismadb";

interface AggregationResult<T = unknown> {
  cursor?: {
    firstBatch: T[];
  };
}

// since prisma adds the $oid and $date automatically, 
// we need to remove them before we pass them back to the client
// this interface provides type safety for the response
interface WrappedItems {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

function cleanResponseItem(rawAdDoc: any) {
  const { _id, userId, createdAt, updatedAt } = rawAdDoc;
  const wrappedItems: WrappedItems = {
    id: _id.$oid.toString(),
    userId: userId.$oid.toString(),
    createdAt: createdAt.$date.toString(),
    updatedAt: updatedAt.$date.toString(),
  };
  return {
    ...rawAdDoc,
    id: wrappedItems.id,
    userId: wrappedItems.userId,
    createdAt: wrappedItems.createdAt,
    updatedAt: wrappedItems.updatedAt,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const phrase = searchParams.get("phrase");
  const input_tags = searchParams.get("input_tags");
  const category = searchParams.get("category");
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const radius = searchParams.get("radius");
  const center = searchParams.get("center");

  const filter: FilterQuery<Ad> = {};

  if (phrase) {
    filter.title = { $regex: ".*" + phrase + ".*", $options: "i" };
  }
  if (input_tags) {
    const tagsArray = input_tags.split(",").map((tag) => tag.trim());
    filter.tags = {
      $regex: tagsArray.join("|"),
      $options: "i",
    };
  }
  if (category) {
    filter.category = category;
  }
  if (min && !max) filter.price = { $gte: parseInt(min) };
  if (max && !min) filter.price = { $lte: parseInt(max) };
  if (min && max) filter.price = { $gte: parseInt(min), $lte: parseInt(max) };

  if (radius && center) {
    const cords = center.split(",");
    const rawAdDocs = await prisma.$runCommandRaw({
      aggregate: "Quest",
      pipeline: [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(cords[1]), parseFloat(cords[0])],
            },
            distanceField: "dist.calculated",
            maxDistance: parseInt(radius),
            spherical: true,
          },
        },
        { $match: filter },
        { $sort: { "dist.calculated": 1, createdAt: -1 } },
      ],
      cursor: {},
    });
    const rawAdDocsTyped = rawAdDocs as AggregationResult;
    if (rawAdDocsTyped?.cursor?.firstBatch) {
      return Response.json(
        (rawAdDocsTyped.cursor?.firstBatch).map(cleanResponseItem)
      );
    } else {
      return Response.json([]); //TODO: add error handling
    }
  } else {
    return Response.json(
      { error: "No location provided or radius provided" },
      { status: 400, statusText: "Bad Request" }
    );
  }
}

// TODO: refactor to prisma and remember that we no longer have a userEmail directly
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return Response.json(
      { success: false, error: "Missing ID" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Fetch the quest by ID and check user
  const quest = await prisma.quest.findUnique({
    where: { id },
    select: { user: { select: { email: true } } },
  });

  if (!quest || quest.user?.email !== session.user.email) {
    return Response.json(
      { success: false, error: "Not authorized or Quest not found" },
      { status: 403 }
    );
  }

  // Delete the quest
  await prisma.quest.delete({
    where: { id },
  });

  return Response.json({ message: "success", success: true }, { status: 200 });
}
