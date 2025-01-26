"use client";

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
import AutoCompleteMap from "./AutoCompleteMap";
import { FormattedAutocompleteLocation } from "@/libs/types";

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
  const [location, setLocation] = useState<
    Location | undefined
  >(defaultLocation);
  const [formattedLocation, setFormattedLocation] = useState<FormattedAutocompleteLocation | null>(null); 
  const [gpsCoords, setGpsCoords] = useState<Location | null>(null);
  const [isPayingByHour, setIsPayingByHour] = useState<boolean>(
    defaultIsPayingByHour
  );
  const [tags, setTags] = useState<string[]>(defaultTags); // New state for tags

  async function handleSubmit(formData: FormData) {
    formData.set("location", JSON.stringify(location));
    formData.set("files", JSON.stringify(files));
    formData.set("isPayingByHour", JSON.stringify(isPayingByHour));
    formData.set("tags", JSON.stringify(tags)); // Add tags to formData
    formData.set("formattedLocation", JSON.stringify(formattedLocation));
    if (id) {
      formData.set("_id", id);
    }
    const result = id ? await updateAd(formData) : await createAd(formData);
    redirect("/ad/" + result._id);
  }

  return (
    <form
      action={handleSubmit}
      className=" max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 flex-wrap"
    >

      <div className="grow pt-2">
        <input
          className={
            (isPayingByHour ? "bg-gray-800" : "bg-theme-green") +
            " mt-2 text-white px-6 py-2 rounded"
          }
          type="button"
          value={"Pay " + (isPayingByHour ? "Hourly" : "Upon Quest Completion")}
          onClick={() => {
            setIsPayingByHour(!isPayingByHour);
          }}
        />
        <AdTextInputs
          isPayingByHour={isPayingByHour}
          defaultValues={defaultTexts}
        />
        <SkillTags tags={tags} setTags={setTags} />
        
      </div>
      <div className="grow lg:pt-8">
        <label htmlFor="">Quest Location</label>
        <AutoCompleteMap
          mapHeight="300px"
          onLocationChange={(location) => setLocation(location)}
          onFormattedLocationChange={(formattedLocation) => setFormattedLocation(formattedLocation)}
        />
        <div className="mt-8">
          <label htmlFor="">Quest Images</label>
        <UploadArea files={files} setFiles={setFiles} />
        </div>
        <SubmitButton>{id ? "Save" : "Publish"}</SubmitButton>
      </div>
 
    </form>
  );
}
