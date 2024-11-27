'use server';

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
       <div className="flex">
            <div className="grow bg-black">Photos</div>
            <div className="w-52 p-4">
                {adDoc.title}
            </div>
       </div>
    );
}