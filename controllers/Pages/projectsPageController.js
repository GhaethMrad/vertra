import MainCategoryModel from "../../models/project/MainCategory.model.js"
import ProjectModel from "../../models/project/Project.model.js"
import SubcategoryModel from "../../models/project/Subcategory.model.js"

export const mainSections = async (req, res) => {
    res.render("layout.ejs", {
        title: "Projects",
        page: "pages/projects/mainSections.ejs",
        pageName: "Projects Page",
        data: await MainCategoryModel.find(),
        subSectionsCount: await SubcategoryModel.countDocuments()
    })
}

export const addSections = async (req, res) => {
    res.render("layout.ejs", {
        title: "Create Projects Sections",
        page: "pages/projects/addSections.ejs",
        pageName: "Add Projects Sections"
    })
}

export const subSections = async (req, res) => {
    res.render("layout.ejs", {
        title: "Projects",
        page: "pages/projects/subSections.ejs",
        pageName: "Projects Page",
        data: await SubcategoryModel.find({mainCategory: req.params.mainId}),
        mainSection: await MainCategoryModel.findById(req.params.mainId)
    })
}

export const addSubSection = async (req, res) => {
    const mainSection = await MainCategoryModel.findById(req.params.id)
    res.render("layout.ejs", {
        title: "Projects",
        page: "pages/projects/addSubSection.ejs",
        pageName: "Create Sub Section",
        id: mainSection._id
    })
}

export const getProjectsBySubSection = async (req, res) => {
    const projects = await ProjectModel.find({subcategory: req.params.id})
    const subSection = await SubcategoryModel.findById(req.params.id)
    res.render("layout.ejs", {
        title: "Projects",
        page: "pages/projects/projects.ejs",
        pageName: `Projects By Section <${subSection.name}>`,
        data: projects 
    })
}

export const addProject = async (req, res) => {
    res.render("layout.ejs", {
        title: "Projects",
        page: "pages/projects/addProject.ejs",
        pageName: "Create Projects",
        data: await SubcategoryModel.find({mainCategory: req.params.id})
    })
}
