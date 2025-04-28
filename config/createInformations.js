import InformationModel from "../models/Information.model.js"

export const createInformations = async () => {
    const count = await InformationModel.countDocuments();

    if (count == 0) {
        await InformationModel.create({
            brief: "test",
            phNumber: "0932365733",
            email: "info@gmail.com",
            whatsApp: "https://wa.link/arj79f",
            facebook: "https://www.facebook.com/gaeth.mrad",
            instagram: "https://www.instagram.com/gaeth.mrad",
            telegram: "https://t.me/ghaethMrad",
            twitter: "https://www.twitter.com",
            linkedIn: "https://www.linkedin.com"
        })
        console.log("Informations Created")
    }
}