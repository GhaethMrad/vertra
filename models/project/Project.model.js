import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String, required: true},
    mimetype: {type: String, required: true},
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    }
})

export default mongoose.model("Project", projectSchema);