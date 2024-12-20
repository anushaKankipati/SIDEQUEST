import { connect } from "@/src/libs/helpers";
import { Ad, AdModel } from "@/src/models/Ad";
import { FilterQuery } from "mongoose";

export async function GET(req: Request, res: Response) {
  await connect();
  //console.log(req);
  const { searchParams } = new URL(req.url);

  const phrase = searchParams.get("phrase");
  const category = searchParams.get("category");
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const radius = searchParams.get("radius");
  const center = searchParams.get("center");

  const filter: FilterQuery<Ad> = {};
  const aggregationSteps = []; 
  if (phrase) {
    filter.title = { $regex: ".*" + phrase + ".*", $options: "i" };
  }
  if (category) {
    filter.category = category;
  }
  if (min && !max) filter.price = { $gte: min };
  if (max && !min) filter.price = { $lte: max };
  if (min && max) filter.price = { $gte: min, $lte: max };
  if (radius) {
    aggregationSteps.push(AdModel.aggregate([
      {
        $geoNear: {
            near: { 
                type: "Point", 
                coordinates: [59.432226005726896, 18.057839558207103] 
            },
            distanceField: "location",
            maxDistance: 10000,
            spherical: true,
      },
    }
    ]));
  }

  const adsDocs = await AdModel.find(filter, null, { sort: { createdAt: -1 } });
  return Response.json(adsDocs);
}
