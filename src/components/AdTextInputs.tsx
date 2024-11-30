import { categories } from "../libs/helpers";

export default function AdTextInputs(){
    return(
        <>
                <label htmlFor="titleIn">Title</label>
                <input name="title" id="titleIn" type="text" placeholder="Title" />

                <label htmlFor="priceIn">Price (how much are you willing to pay a worker?)</label>
                <input name="price" id="priceIn" type="number" placeholder="$" />

                <label htmlFor="categoryIn">Category</label>
                <select name="category" id="categoryIn" defaultValue="0">
                    <option disabled value="0">select category</option>
                    {categories.map(({key:categoryKey,label:categoryLabel}) => (
                        <option key={categoryKey} value={categoryKey}>{categoryLabel}</option>
                    ))}
                </select>

                <label htmlFor="descriptionIn">Description</label>
                <textarea name="description" id="descriptionIn" placeholder="description"></textarea>

                <label htmlFor="timeIn">Time estimate</label>
                <input name="time_estimate" id="timeIn" type="number" step="0.1" placeholder="Enter hours (e.g., 1.5 for 1 hour 30 minutes)" />

                <label htmlFor="contactIn">Contact Information</label>

                <textarea name="contact" id="contactIn" placeholder="mobile: 669-225-6980"></textarea>
        </>
    )
}