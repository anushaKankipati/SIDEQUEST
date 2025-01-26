"use client";

import { useEffect, useRef, useState } from "react";
import { categories, defaultRadius } from "../../libs/helpers";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import LabelRadioButton from "./LabelRadioButton";
import SubmitButton from "./SubmitButton";
import DistancePicker from "./DistancePicker";
import { Location } from "./LocationPicker";
import useCurrentLocation from "../hooks/useCurrentLocation";
import useRadius from "../hooks/useRadius";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import useIsPayingHourly from "../hooks/useIsPayingHourly";
import { getRedirectStatusCodeFromError } from "next/dist/client/components/redirect";
import SkillTags from "./SkillTags";

type Props = {
  onSearch: (formData: FormData) => void;
};

export default function SearchForm({ onSearch }: Props) {
  const [tags, setTags] = useState<string[]>([]); // New state for tags
  const [tagsFilter, setTagsFilter] = useState('');
  const radius = useRadius((state) => state.radius);
  const setRadius = useRadius((state) => state.setRadius);
  const center = useCurrentLocation((state) => state.currLocation);
  const setCenter = useCurrentLocation((state) => state.setCurrLocation);
  const [prevCenter, setPrevCenter] = useState<Location | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [fixedFilterClicked, setFixedFilterClicked] = useState<boolean>(false);
  const [hourlyFilterClicked, setHourlyFilterClicked] =
    useState<boolean>(false);
  const isPayingHourly = useIsPayingHourly((state) => state.isPayingHourly);
  const setIsPayingHourly = useIsPayingHourly(
    (state) => state.setIsPayingHourly
  );
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
    formData.set("hourly", JSON.stringify(isPayingHourly));
    formData.set("input_tags", tagsFilter);
    onSearch(formData);
  }

  function handleTagsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTagsFilter(e.target.value);
  }

  function handleOnlyHourly() {
    // using this variable since react will update the state once the function exists and not in time
    // before the onSearch function executes
    let searchState;
    if (!hourlyFilterClicked) {
      searchState = true;
      setIsPayingHourly(true);
      setFixedFilterClicked(false);
      setHourlyFilterClicked(true);
    } else {
      searchState = undefined;
      setHourlyFilterClicked(false);
      setIsPayingHourly(undefined);
    }
    const formData = new FormData(formRef.current!);
    formData.set("hourly", JSON.stringify(searchState));
    onSearch(formData);
  }

  function handleFixedRateOnly() {
    let searchState;
    if (!fixedFilterClicked) {
      searchState = false;
      setIsPayingHourly(false);
      setFixedFilterClicked(true);
      setHourlyFilterClicked(false);
    } else {
      setIsPayingHourly(undefined);
      searchState = undefined;
      setFixedFilterClicked(false);
    }
    // setIsPayingHourly(false)
    const formData = new FormData(formRef.current!);
    formData.set("hourly", JSON.stringify(searchState));
    onSearch(formData);
  }

  function handleHourlyXClicked() {
    setIsPayingHourly(undefined);
    setHourlyFilterClicked(false);
    const formData = new FormData(formRef.current!);
    formData.set("hourly", JSON.stringify(undefined));
    onSearch(formData);
  }

  function handleFixedXClicked() {
    setIsPayingHourly(undefined);
    setFixedFilterClicked(false);
    const formData = new FormData(formRef.current!);
    formData.set("hourly", JSON.stringify(undefined));
    onSearch(formData);
  }

  useEffect(() => {
    if (center) formRef.current?.requestSubmit();
  }, []);
  return (
    <form
      ref={formRef}
      action={onSearch}
      className="bg-white grow w-1/4 p-4 border-r flex flex-col gap-4 overflow-y-auto"
    >
      <input name="phrase" type="text" placeholder="Search SIDEQUE$T..." />
      <div className="">
        <SkillTags
          tags={tags}
          setTags={setTags}
        />
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
          icon={faStore}
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

      <div>
        <label>Preferred Quest Modality</label>
        <div className="flex justify-between items-center flex-wrap">
          <div className="shrink relative">
            <button
              title={"X button wrapped"}
              onClick={() => {
                if (!hourlyFilterClicked) {
                  handleOnlyHourly();
                } else {
                  handleHourlyXClicked();
                }
              }}
              >
              {/* Reserve space for the icon */}
              <div
                className={
                  "absolute top-1/2 left-1 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center"
                }
              >
                {hourlyFilterClicked && (
                  <FontAwesomeIcon
                    icon={faX}
                    color="white"
                    className="cursor-pointer"
                  />
                )}
              </div>
            </button>
            <input
              className={`
        ${
          hourlyFilterClicked
            ? "bg-theme-green text-white"
            : "bg-white text-gray-400 border border-gray-200"
        } 
        mt-2 px-6 py-2 rounded cursor-pointer wrap
      `}
              type="button"
              name="hourly"
              value="Hourly Only"
              onClick={handleOnlyHourly}
            />
          </div>

          <div className="shrink relative">
            <button
              onClick={() => {
                if (!fixedFilterClicked) {
                  handleFixedRateOnly();
                } else {
                  handleFixedXClicked();
                }
              }}
              >
              {/* Reserve space for the icon */}
              <div
                className={
                  "absolute top-1/2 left-1 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center"
                }
              >
                {fixedFilterClicked && (
                  <FontAwesomeIcon
                    icon={faX}
                    color="white"
                    className="cursor-pointer"
                  />
                )}
              </div>
            </button>
            <input
              className={`
        ${
          fixedFilterClicked
            ? "bg-theme-green text-white"
            : "bg-white text-gray-400 border border-gray-200"
        } 
        mt-2 px-6 py-2 rounded cursor-pointer wrap
      `}
              type="button"
              name="hourly"
              value="Fixed Only"
              onClick={handleFixedRateOnly}
            />
          </div>
        </div>{" "}
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
