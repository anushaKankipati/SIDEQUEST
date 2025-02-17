import { connect } from "@/libs/helpers";
import { Ad, AdModel } from "@/src/models/Ad";
import { FilterQuery } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/libs/prismadb";

interface AggregationResult<T = unknown> {
  cursor?: {
    firstBatch: T[];
  };
}

interface WrappedItems {
  _id: string, 
  userId: string,
  createdAt: string,
  updatedAt: string,
}

function cleanResponseItem(rawAdDoc: any) {
  const { _id, userId, createdAt, updatedAt } = rawAdDoc;
  const wrappedItems: WrappedItems = {
    _id: _id.$oid.toString() ,
    userId:  userId.$oid.toString() ,
    createdAt: createdAt.$date.toString(),
    updatedAt: updatedAt.$date.toString(),  
  }
  return {
    ...rawAdDoc,
    _id: wrappedItems._id,
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
        { $sort: { createdAt: -1 } },
      ],
      cursor: {},
    });
    const rawAdDocsTyped = rawAdDocs as AggregationResult;
    if (rawAdDocsTyped?.cursor?.firstBatch) {
      return Response.json((rawAdDocsTyped.cursor?.firstBatch).map(cleanResponseItem));
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
  await connect();
  const rawAdDoc = await AdModel.findById(id);
  const session = await getServerSession(authOptions);
  if (!rawAdDoc || rawAdDoc.userId !== session?.user?.email) {
    return Response.json(false);
  }

  await AdModel.findByIdAndDelete(id);
  return Response.json(true);
}
