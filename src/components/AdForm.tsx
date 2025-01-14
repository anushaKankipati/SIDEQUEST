"use client"

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdTextInputs, { AdTexts } from "./AdTextInputs";
import LocationPicker, { Location } from "./LocationPicker";
import SubmitButton from "./SubmitButton";
import UploadArea from "./UploadArea";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { redirect } from "next/navigation";
import { createAd, updateAd } from "../app/actions/adActions";
import SkillTags from "./SkillTags";

type Props = {
  id?: string | null;
  defaultFiles?: UploadResponse[];
  defaultLocation: Location;
  defaultTexts?: AdTexts;
  defaultIsPayingByHour?: boolean; 
  defaultTags?: string[];
};

export default function AdForm({
  id = null,
  defaultFiles = [],
  defaultLocation,
  defaultTexts = {},
  defaultIsPayingByHour = false,
  defaultTags = [],
}: Props) {
  const [files, setFiles] = useState<UploadResponse[]>(defaultFiles);
  const [location, setLocation] = useState<Location | undefined>(defaultLocation);
  const [gpsCoords, setGpsCoords] = useState<Location | null>(null);
  const [isPayingByHour, setIsPayingByHour] = useState<boolean>(defaultIsPayingByHour); 
  const [tags, setTags] = useState<string[]>(defaultTags); // New state for tags

  function handleFindMyPositionClick() {
    navigator.geolocation.getCurrentPosition((ev) => {
      const location = { lng: ev.coords.longitude, lat: ev.coords.latitude };
      setLocation(location);
      setGpsCoords(location);
    }, console.error);
  }

  async function handleSubmit(formData: FormData) {
    formData.set("location", JSON.stringify(location));
    formData.set("files", JSON.stringify(files));
    formData.set("isPayingByHour", JSON.stringify(isPayingByHour)); 
    formData.set("tags", JSON.stringify(tags)); // Add tags to formData
    if (id) {
      formData.set("_id", id);
    }
    const result = id ? await updateAd(formData) : await createAd(formData);
    redirect("/ad/" + result._id);
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

      <div className="grow pt-2">
        <input
          className={(isPayingByHour ? 'bg-gray-800' : 'bg-theme-green') + " mt-2 text-white px-6 py-2 rounded"}
          type="button"
          value={"Pay " + (isPayingByHour ? "Hourly" : "Upon Quest Completion")}
          onClick={() => { setIsPayingByHour(!isPayingByHour); }}
        />
        <AdTextInputs isPayingByHour={isPayingByHour} defaultValues={defaultTexts} />
        <SkillTags
          setTags={setTags} 
        />
        <SubmitButton>{id ? "Save" : "Publish"}</SubmitButton>
      </div>
    </form>
  );
}
