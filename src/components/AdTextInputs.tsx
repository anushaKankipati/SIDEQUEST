export default function AdTextInputs(){
    return(
        <>
                <label htmlFor="titleIn">Title</label>
                <input name="title" id="titleIn" type="text" placeholder="Title" />

                <label htmlFor="priceIn">Price</label>
                <input name="price" id="priceIn" type="number" placeholder="Price" />

                <label htmlFor="categoryIn">Category</label>
                <select name="category" id="categoryIn" defaultValue="0">
                    <option disabled value="0">Select category</option>
                    <option value="cars">Cars</option>
                    <option value="electronics">Electronics</option>
                    <option value="properties">Properties</option>
                </select>

                <label htmlFor="descriptionIn">Description</label>
                <textarea name="description" id="descriptionIn" placeholder="description"></textarea>

                <label htmlFor="contactIn">Contact Information</label>

                <textarea name="contact" id="contactIn" placeholder="mobile: 669-225-6980"></textarea>
        </>
    )
}