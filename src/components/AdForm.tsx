"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdTextInputs, { AdTexts } from "./AdTextInputs";
import LocationPicker, { Location } from "./LocationPicker";
import SubmitButton from "./SubmitButton";
import UploadArea from "./UploadArea";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { useState } from "react";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { redirect } from "next/navigation";
import { createAd, updateAd } from "../app/actions/adActions";

type Props = {
  id?: string | null;
  defaultFiles?: UploadResponse[];
  defaultLocation: Location;
  defaultTexts?: AdTexts;
};

export default function AdForm({
  id = null,
  defaultFiles = [],
  defaultLocation,
  defaultTexts = {},
}: Props) {
  const [files, setFiles] = useState<UploadResponse[]>(defaultFiles);
  const [location, setLocation] = useState<Location | undefined>(
    defaultLocation
  );
  const [gpsCoords, setGpsCoords] = useState<Location | null>(null);

  function handleFindMyPositionClick() {
    navigator.geolocation.getCurrentPosition((ev) => {
      const location = { lat: ev.coords.latitude, lng: ev.coords.longitude };
      setLocation(location);
      setGpsCoords(location);
    }, console.error);
  }

  async function handleSubmit(formData: FormData) {
    formData.set("location", JSON.stringify(location));
    formData.set("files", JSON.stringify(files));
    if (id) {
      formData.set("_id", id); 
    }
    const result = id ? await updateAd(formData) : createAd(formData); 
    redirect("/ad/"+result._id); 
  }

  return (
    <form
      action={handleSubmit}
      className=" max-w-2xl mx-auto grid grid-cols-2 gap-12"
    >
      <div className="grow pt-8">
        <UploadArea files={files} setFiles={setFiles} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="" className="mt-0 mb-0">
              Where?
            </label>
            <div>
              <button
                title="find-my-location"
                type="button"
                onClick={handleFindMyPositionClick}
                className="flex p-1 items-center gap-1 justify-center text-gray-600 rounded"
              >
                <FontAwesomeIcon icon={faLocationCrosshairs} />
              </button>
            </div>
          </div>

          <div className="bg-gray-100  rounded overflow-hidden text-gray-400 text-center">
            <LocationPicker
              defaultLocation={defaultLocation}
              gpsCoords={gpsCoords}
              onChange={(location) => setLocation(location)}
            />
          </div>
        </div>
      </div>

      <div className=" grow pt-2">
        <AdTextInputs defaultValues={defaultTexts} />
        <SubmitButton>{id ? "Save" : "Publish"}</SubmitButton>
      </div>
    </form>
  );
}
