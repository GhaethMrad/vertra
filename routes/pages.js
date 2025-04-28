import express from "express";
import { login } from "../controllers/Pages/loginPageController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { index } from "../controllers/Pages/indexPageController.js";
import { addService, allServices, editService, serviceSections } from "../controllers/Pages/servicesPageController.js";
import { informations } from "../controllers/Pages/informationsPageController.js";
import { allMessage } from "../controllers/Pages/messagesPageController.js";
import { addProject, addSections, addSubSection, getProjectsBySubSection, mainSections, subSections } from "../controllers/Pages/projectsPageController.js";

const router = express.Router();

//  Start Login  //
router.get("/", (req, res) => {
    res.redirect("/login")
})
router.get("/login", login);
//  End Login  //

//  Start dashboard  //
router.get("/dashboard", isAuthenticated, index)
//  End dashboard  //

//  Start Services  //
router.get("/services", isAuthenticated, allServices)
router.get("/services/create", isAuthenticated, addService)
router.get("/services/edit/:id", isAuthenticated, editService)
router.get("/services/:id/sections", isAuthenticated, serviceSections)
//  End Services  //

//  Start Projects  //
router.get("/projects", isAuthenticated, mainSections)
router.get("/projects/:id", isAuthenticated, getProjectsBySubSection)
router.get("/projects/subSections/:mainId", isAuthenticated, subSections)
router.get("/projects/create/sections", isAuthenticated, addSections)
router.get("/projects/create/:id", isAuthenticated, addProject)
router.get("/projects/createSubSection/:id", isAuthenticated, addSubSection)
//  End Projects  //

//  Start Informations  //
router.get("/informations", isAuthenticated, informations)
//  End Informations  //

//  Start Messages  //
router.get("/message", isAuthenticated, allMessage)
//  End Messages  //

export default router;