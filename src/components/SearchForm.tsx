"use client";

import { useEffect, useRef, useState } from "react";
import { categories, defaultRadius } from "../../libs/helpers";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import LabelRadioButton from "./LabelRadioButton";
import SubmitButton from "./SubmitButton";
import DistancePicker from "./DistancePicker";
import { Location } from "./LocationPicker";
import useCurrentLocation from "../hooks/useCurrentLocation";
import useRadius from "../hooks/useRadius";
import SkillTags from "./SkillTags";

type Props = {
  onSearch: (formData: FormData) => void;
};

export default function SearchForm({ onSearch }: Props) {
  const [tags, setTags] = useState<string[]>([]); // New state for tags
  const [tagsFilter, setTagsFilter] = useState("");
  const radius = useRadius((state) => state.radius);
  const setRadius = useRadius((state) => state.setRadius);
  const center = useCurrentLocation((state) => state.currLocation);
  const setCenter = useCurrentLocation((state) => state.setCurrLocation);
  const [prevCenter, setPrevCenter] = useState<Location | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    if (center && !prevCenter) {
      formRef.current?.requestSubmit();
      setPrevCenter(center);
    }
  }, [center]);

  function handleMinPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMinPrice(e.target.value);
  }

  function handleMaxPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMaxPrice(e.target.value);
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    const formData = new FormData(formRef.current!);
    formData.set("category", category);
    formData.set("input_tags", tagsFilter);
    onSearch(formData);
  }

  function handleTagsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTagsFilter(e.target.value);
  }

  useEffect(() => {
    if (center) formRef.current?.requestSubmit();
  }, []);
  return (
    <form
      ref={formRef}
      action={onSearch}
      className="bg-white grow w-1/4 p-4 border-r flex flex-col gap-3 overflow-y-auto"
    >
      <div>
        <label className="mt-0 p-0" htmlFor="phraseSearch">
          Search for Quests
        </label>
        <input
          id="phraseSearch"
          name="phrase"
          type="text"
          placeholder="Search SIDEQUE$T..."
        />
      </div>
      <div className="">
        <SkillTags tags={tags} setTags={setTags} />
        <input
          name="input_tags"
          type="hidden" //Hidden input to pass tags as "input_tags" parameter
          value={tags}
          onChange={handleTagsChange}
        />
      </div>
      <label>Preferred Quest Modality</label>
      <div className="flex flex-col gap-0">
        <LabelRadioButton
          key={"category"}
          name={"category"}
          value={""}
          icon={faMoneyBillWave}
          onClick={handleCategoryChange}
          isSelected={selectedCategory === ""}
          label={"Either"}
        />
        {categories.map(({ key: categoryKey, label, icon }) => (
          <LabelRadioButton
            key={categoryKey}
            name={"category"}
            value={categoryKey}
            icon={icon}
            onClick={handleCategoryChange}
            isSelected={selectedCategory === categoryKey}
            label={label}
          />
        ))}
      </div>

      <div className="">
        <label>Filter by price</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              name="min"
              type="number"
              placeholder="min"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
          </div>
          <div>
            <input
              name="max"
              type="number"
              placeholder="max"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>
      <div>
        <input type="hidden" name="radius" value={radius}></input>
        <input
          type="hidden"
          name="center"
          value={[JSON.stringify(center?.lat), JSON.stringify(center?.lng)]}
        ></input>
        <DistancePicker
          defaultRadius={defaultRadius}
          onChange={({ radius, center }) => {
            setRadius(radius);
            setCenter(center);
          }}
        />
      </div>
      <SubmitButton>Search</SubmitButton>
    </form>
  );
}
