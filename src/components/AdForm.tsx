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
  defaultFormattedLocation?: FormattedAutocompleteLocation | null;
};

export default function AdForm({
  id = null,
  defaultFiles = [],
  defaultLocation,
  defaultTexts = {},
  defaultTags = [],
  defaultFormattedLocation = null,
}: Props) {
  const [files, setFiles] = useState<UploadResponse[]>(defaultFiles);
  const [location, setLocation] = useState<Location | undefined>(
    defaultLocation
  );
  const [formattedLocation, setFormattedLocation] =
    useState<FormattedAutocompleteLocation | null>(defaultFormattedLocation);
  const [tags, setTags] = useState<string[]>(defaultTags); // New state for tags

  async function handleSubmit(formData: FormData) {
    formData.set("location", JSON.stringify(location));
    formData.set("files", JSON.stringify(files));
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
      className=" max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-12 flex-wrap"
    >
      <div className="grow pt-2">
        <AdTextInputs defaultValues={defaultTexts} />
        <SkillTags tags={tags} setTags={setTags} />
      </div>
      <div className="grow lg:pt-2">
        <label htmlFor="">Quest Location</label>
        <AutoCompleteMap
          defaultLocation={defaultLocation}
          mapHeight="300px"
          onLocationChange={(location) => setLocation(location)}
          onFormattedLocationChange={(formattedLocation) =>
            setFormattedLocation(formattedLocation)
          }
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
