'use server';

import Gallery from "@/src/components/Gallery";
import UploadThumbnail from "@/src/components/UploadThumbnail";
import UploadView from "@/src/components/UploadView";
import { connect } from "@/src/libs/helpers";
import { AdModel } from "@/src/models/Ad";



type Props = {
    params: {
        id: string;
    };
    searchParams: {[key: string]: string};
};

export default async function SingleAdPage(args: Props) {
    await connect();
    const adDoc = await AdModel.findById(args.params.id);
    if(!adDoc){
        return 'Not Found';
    }
    return (
       <div className="flex absolute inset-0 top-16">
            <div className="w-3/5 grow bg-black text-white flex flex-col relative">
                <Gallery files={adDoc.files} />
            </div>
                
            <div className="w-2/5 p-8 grow shrink-0">
                <h1 className="text-lg bold">{adDoc.title}</h1>
                <label>Category</label>
                <p>{adDoc.category}</p>
                <label>description</label>
                <p className="text-sm">{adDoc.description}</p>
                <label>Time estimate</label>
                <p className="text-sm">{adDoc.time_estimate} hrs</p>
                <label>contact</label>
                <p>{adDoc.contact}</p>
            </div>
       </div>
    );
}