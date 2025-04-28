import InformationModel from "../../models/Information.model.js"

export const informations = async (req, res) => {
    res.render("layout.ejs", {
        title: "Public Informations",
        page: "pages/informations/informations.ejs",
        pageName: "Public Informations",
        data: await InformationModel.findById("67fa376b997fb2dae884d732")
    })
}