export default function AdTextInputs(){
    return(
        <>
                <label htmlFor="titleIn">Title</label>
                <input id="titleIn" type="text" placeholder="Title" />

                <label htmlFor="priceIn">Price</label>
                <input id="priceIn" type="number" placeholder="Price" />

                <label htmlFor="categoryIn">Category</label>
                <select name="category" id="categoryIn" defaultValue="">
                    <option disabled value="">Select category</option>
                    <option value="Cars">Cars</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Properties">Properties</option>
                </select>

                <label htmlFor="descriptionIn">Description</label>
                <textarea name="" id="descriptionIn" placeholder="description"></textarea>

                <label htmlFor="contactIn">Contact Information</label>

                <textarea name="" id="contactIn" placeholder="mobile: 669-225-6980"></textarea>
        </>
    )
}