import mongoose from "mongoose";

const mainCategorySchema = new mongoose.Schema({
    name: String,
    img: String
});

export default mongoose.model('MainCategory', mainCategorySchema);