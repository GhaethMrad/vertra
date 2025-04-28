import ServiceModel from "../../models/Service.model.js"

export const allServices = async (req, res) => {
    res.render("layout.ejs", {
        title: "Services",
        page: "pages/services/allServices.ejs",
        pageName: "Services Page",
        data: await ServiceModel.find(),
        searchQuery: ""
    })
}

export const addService = (req, res) => {
    res.render("layout.ejs", {
        title: "Create Service",
        page: "pages/services/addService.ejs",
        pageName: "Add Service Page"
    })
}

export const editService = async (req, res) => {
    res.render("layout.ejs", {
        title: "Edit Service",
        page: "pages/services/editService.ejs",
        pageName: `Edit Service`,
        data: await ServiceModel.findById(req.params.id)
    })
}

export const serviceSections = async (req, res) => {
    const service = await ServiceModel.findById(req.params.id)

    res.render("layout.ejs", {
        title: "Service Sections",
        page: "pages/services/serviceSections.ejs",
        pageName: `${service.serviceName} Sections`,
        data: service.sections,
        id: service._id
    })
}