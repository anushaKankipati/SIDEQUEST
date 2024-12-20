'use client';

import { useEffect, useRef, useState } from "react";
import { categories, defaultRadius } from "../libs/helpers";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import LabelRadioButton from "./LabelRadioButton";
import SubmitButton from "./SubmitButton";
import DistancePicker from "./DistancePicker";
import {Location} from "./LocationPicker"

type Props = {
  onSearch: (formData: FormData) => void;
};

export default function SearchForm({ onSearch }: Props) {
  const [radius, setRadius] = useState(defaultRadius);
  const [center, setCenter] = useState<Location|null>(null);
  const [prevCenter, setPrevCenter] = useState<Location|null>(null);
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
    formData.set('category', category);
    onSearch(formData);
  }
  // useEffect(() => {
  //   if(radius !== defaultRadius){
  //     formRef.current?.requestSubmit();
  //   }
  // }, [radius])
  useEffect(() => {
    if (center) {

    }
  })
  return (
    <form 
      ref={formRef}
      action={onSearch}
      className="bg-white grow w-1/4 p-4 border-r flex flex-col gap-4"
    >
      <input name="phrase" type="text" placeholder="Search SIDEQUE$T..." />
      <div className="flex flex-col gap-0">
        <LabelRadioButton 
          key={'category'}
          name={'category'} 
          value={''}
          icon={faStore}
          onClick={handleCategoryChange}
          isSelected={selectedCategory === ''}
          label={'All Categories'}
        />
        {categories.map(({key:categoryKey, label, icon}) => (
          <LabelRadioButton 
            key={categoryKey}
            name={'category'} 
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
        <input type="hidden" name="center" value={center?.lat}></input>
        <DistancePicker 
          defaultRadius={defaultRadius} 
          onChange={({radius, center}) => {
            setRadius(radius); 
            setCenter(center); 
          }}/>
      </div>
      <SubmitButton>Search</SubmitButton>
    </form>
  );
}

