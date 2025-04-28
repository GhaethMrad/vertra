import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceName: {type: String, required: true},
    serviceImage: {type: String, required: true},
    sections: [
        {
            title: {type: String, required: true},
            img: {type: String, required: true},
            desc: {type: String, required: true}
        },
    ],
})

export default mongoose.model("service", serviceSchema)