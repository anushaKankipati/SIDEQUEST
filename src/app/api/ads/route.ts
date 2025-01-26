import { connect } from "@/libs/helpers";
import { Ad, AdModel } from "@/src/models/Ad";
import { FilterQuery, PipelineStage } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request, res: Response) {
  await connect();
  const { searchParams } = new URL(req.url);

  const phrase = searchParams.get("phrase");
  const input_tags = searchParams.get("input_tags");
  const category = searchParams.get("category");
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const radius = searchParams.get("radius");
  const center = searchParams.get("center");
  let hourly = searchParams.get("hourly"); 

  const filter: FilterQuery<Ad> = {};
  const aggregationSteps: PipelineStage[] = [];
  if (phrase) {
    filter.title = { $regex: ".*" + phrase + ".*", $options: "i" };
  }
  if (input_tags) {
    const tagsArray = input_tags.split(',').map(tag => tag.trim());
    filter.tags = {
      $regex: tagsArray.join('|'),
      $options: "i"
    };
  }
  if (category) {
    filter.category = category;
  }
  if (min && !max) filter.price = { $gte: parseInt(min) };
  if (max && !min) filter.price = { $lte: parseInt(max) };
  if (min && max) filter.price = { $gte: parseInt(min), $lte: parseInt(max) };
  if (!hourly) hourly = "undefined"
  if (hourly != "undefined") {
    console.log("filter called", hourly); 
    filter.isPayingByHour = JSON.parse(hourly as string); 
  }
  if (radius && center) {
    const cords = center.split(",");
    aggregationSteps.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(cords[1]), parseFloat(cords[0])],
        },
        distanceField: "location",
        maxDistance: parseInt(radius),
        spherical: true,
      },
    });
  }
  aggregationSteps.push({
    $match: filter,
  });
  aggregationSteps.push({
    $sort: { createdAt: -1 },
  });
  const adsDocs = await AdModel.aggregate(aggregationSteps);
  return Response.json(adsDocs);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  await connect();
  const adDoc = await AdModel.findById(id);
  const session = await getServerSession(authOptions);
  if (!adDoc || adDoc.userEmail !== session?.user?.email) {
    return Response.json(false);
  }

  await AdModel.findByIdAndDelete(id);
  return Response.json(true);
}
