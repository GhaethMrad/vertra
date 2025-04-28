import MessageModel from "../../models/Message.model.js"
import ProjectModel from "../../models/project/Project.model.js"
import ServiceModel from "../../models/Service.model.js"

export const index = async (req, res) => {
    res.render("layout.ejs", {
        title: "Home",
        page: "pages/index.ejs",
        pageName: "Home Page",
        countServices: await ServiceModel.countDocuments(),
        countProjects: await ProjectModel.countDocuments(),
        countMessage: await MessageModel.countDocuments()
    })
}