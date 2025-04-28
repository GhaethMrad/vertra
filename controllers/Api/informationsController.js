import InformationModel from "../../models/Information.model.js"

export const getAllInformations = async (req, res) => {
    try {
        const informations = await InformationModel.find();
        res.status(200).json(informations)
    } catch (error) {
        res.json({message: error.message})
    }
}

export const editInformations = async (req, res) => {
    try {
        const informations = await InformationModel.findById("67fa376b997fb2dae884d732")
        const information = await InformationModel.findByIdAndUpdate("67fa376b997fb2dae884d732", {
            brief: req.body.brief || informations.brief,
            phNumber: req.body.phNumber || informations.phNumber,
            email: req.body.email || informations.email,
            whatsApp: req.body.whatsApp || informations.whatsApp,
            facebook: req.body.facebook || informations.facebook,
            instagram: req.body.instagram || informations.instagram,
            telegram: req.body.telegram || informations.telegram,
            twitter: req.body.twitter || informations.twitter,
            linkedIn: req.body.linkedIn || informations.linkedIn 
        })
        await information.save();
        res.status(200).redirect("/informations?done")
    } catch (error) {
        res.json({message: error.message});
    }
}