import mongoose from "mongoose";

const informationSchema = new mongoose.Schema({
    brief: {type: String, required: true},
    phNumber: {type: String, required: true},
    email: {type: String, required: true},
    whatsApp: {type: String, required: true},
    facebook: {type: String, required: true},
    instagram: {type: String, required: true},
    telegram: {type: String, required: true},
    twitter: {type: String, required: true},
    linkedIn: {type: String, required: true}
})

export default mongoose.model("information", informationSchema);