import { useState } from "react";
import { categories } from "../../libs/helpers";

export type AdTexts = {
  title?: string;
  price?: string|number;
  category?: string;
  description?: string;
  time_estimate?: string|number;
  contact?: string;
};

type Props = {
  defaultValues: AdTexts;
};

export default function AdTextInputs({ defaultValues }: Props) {

  const [questModality, setQuestModality] = useState<string>("fixed");  
  return (
    <>
      <label htmlFor="titleIn">Title</label>
      <input
        name="title"
        id="titleIn"
        type="text"
        placeholder="Title"
        defaultValue={defaultValues.title}
      />

      <label htmlFor="priceIn">
        Price (how much are you willing to pay a worker {questModality === "hourly" ? "By Hour": "Upon Completion"}?)
      </label>
      <input
        name="price"
        id="priceIn"
        type="number"
        min="0"
        step = "0.1"
        onKeyDown={(e) => {
          if (e.key =="e"||e.key == "-"){
            e.preventDefault();
          }
        }}
        placeholder="$"
        defaultValue={defaultValues.price}
      />

      <label htmlFor="categoryIn">Preferred Quest Modality</label>
      <select
        name="category"
        id="categoryIn"
        defaultValue={defaultValues.category || "fixed"}
        onChange={(ev) => setQuestModality(ev.target.value)}
      >
        <option disabled value="0">
          select category
        </option>
        {categories.map(({ key: categoryKey, label: categoryLabel }) => (
          <option key={categoryKey} value={categoryKey}>
            {categoryLabel}
          </option>
        ))}
      </select>

      <label htmlFor="descriptionIn">Description</label>
      <textarea
        name="description"
        id="descriptionIn"
        placeholder="description"
        defaultValue={defaultValues.description}
      ></textarea>

      <label htmlFor="timeIn">Time estimate</label>
      <input
        name="time_estimate"
        id="timeIn"
        type="number"
        min="0"
        onKeyDown={(e) => {
          if (e.key =="e"||e.key == "-"){
            e.preventDefault();
          }
        }}
        step="0.1"
        placeholder="Enter hours (e.g., 1.5 for 1 hour 30 minutes)"
        defaultValue={defaultValues.time_estimate}
      />

      <label htmlFor="contactIn">Additional Contact Information</label>

      <textarea
        name="contact"
        id="contactIn"
        placeholder="Enter an optional external contact info. Messaging interface provided in app"
        defaultValue={defaultValues.contact}
      ></textarea>
    </>
  );
}
