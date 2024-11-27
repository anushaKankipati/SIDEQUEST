'use client';
import AdTextInputs from "@/src/components/AdTextInputs";
import LocationPicker, {Location} from "@/src/components/LocationPicker";
import UploadArea from "@/src/components/UploadArea";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { useState } from "react";
import { createAd } from "../actions/adActions";
import SubmitButton from "@/src/components/SubmitButton";
import { redirect } from "next/navigation";

const locationDefault = {
    lat: 59.432226005726896,
    lng: 18.057839558207103,
}



export default function NewAdPage(){
    const [files, setFiles] = useState<UploadResponse[]>([]);
    const [location, setLocation] = useState<Location>(locationDefault);
    const [gpsCoords, setGpsCoords] = useState<Location | null>(null);

    function handleFindMyPositionClick(){
        navigator.geolocation.getCurrentPosition(ev =>{
            const location = {lat: ev.coords.latitude, lng: ev.coords.longitude};
            setLocation(location);
            setGpsCoords(location);
        }, console.error);
    }

    async function handleSubmit(formData:FormData){
        formData.set('location', JSON.stringify(location));
        formData.set('files', JSON.stringify(files));
        const result = await createAd(formData);
        console.log({result});
        redirect('/ad/'+result._id);
    }

    return(
        <form 
            action={handleSubmit}
            className=" max-w-2xl mx-auto grid grid-cols-2 gap-12"
        >

            <div className="grow pt-8">
               <UploadArea files={files} setFiles={setFiles}/>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="" className="mt-0 mb-0">Where?</label>
                        <div>
                            <button 
                                type="button"
                                onClick={handleFindMyPositionClick}
                                className="flex p-1 items-center gap-1 justify-center text-gray-600 rounded">
                                <FontAwesomeIcon icon={faLocationCrosshairs}/>
                            </button>
                        </div>
                       
                    </div>
                    
                    <div className="bg-gray-100  rounded overflow-hidden text-gray-400 text-center">
                       <LocationPicker 
                            defaultLocation={locationDefault}
                            gpsCoords={gpsCoords}
                            onChange={location => setLocation(location)}
                        />
                    </div>
                </div>
            </div>

            <div className=" grow pt-2">
                <AdTextInputs />
                <SubmitButton>Publish</SubmitButton>
            </div>
        </form>
    )
}