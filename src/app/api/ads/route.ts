import { connect } from "@/src/libs/helpers";
import { Ad, AdModel } from "@/src/models/Ad";
import { FilterQuery } from "mongoose";


export async function GET(req: Request, res: Response){
    await connect();
    //console.log(req);
    const {searchParams}= new URL(req.url);

    const phrase = searchParams.get('phrase');
    const category = searchParams.get('category');
    const filter:FilterQuery<Ad> = {};
    if(phrase){
        filter.title = {$regex: '.*'+phrase+'.*', $options: 'i'};
    }
    if(category){
        filter.category = category;
    }
    const adsDocs = await AdModel.find(filter, null, {sort:{createdAt:-1}});
    return Response.json(adsDocs);
}