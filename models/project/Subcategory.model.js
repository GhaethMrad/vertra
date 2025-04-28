import mongoose from "mongoose";

const subcategorySchema  = new mongoose.Schema({
    name: {type: String, required: true},
    img: {type: String, required: true},
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MainCategory'
    }
})

export default mongoose.model("Subcategory", subcategorySchema)