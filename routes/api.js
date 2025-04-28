import express from "express";
import { login } from "../controllers/Api/loginController.js";
import { addService, deleteService, editService, editServiceSection, getAllServices, getServicesByTitle } from "../controllers/Api/servicesController.js";
import { editInformations, getAllInformations } from "../controllers/Api/informationsController.js";
import {  isAuthenticated, } from "../middlewares/isAuthenticated.js";
import { deleteAll, deleteOne, message } from "../controllers/Api/messageController.js";
import { addNewProject, addProjectsSections, addSubSection, delete_All_Projects_SubSections, deleteProject, deleteSubSection, getAllProjects, getProjectsBySubSection } from "../controllers/Api/projectsController.js";

const router = express.Router();

//  Start Login  //
router.post("/", login)
//  End Login  //

//  Start Services  //
router.get("/services", isAuthenticated, getAllServices)
router.get("/services/search", isAuthenticated, getServicesByTitle)
router.post("/services", isAuthenticated, addService)
router.put("/services/:id", isAuthenticated, editService)
router.put("/services/:id/sections/:sectionId", isAuthenticated, editServiceSection)
router.delete("/services/:id", isAuthenticated, deleteService)
//  End Services  //

//  Start Projects  //
router.get("/projects", isAuthenticated, getAllProjects)
router.get("/projects/:id", isAuthenticated, getProjectsBySubSection)
router.post("/projects/sections", isAuthenticated, addProjectsSections)
router.post("/projects/subSection/:id", isAuthenticated, addSubSection)
router.post("/projects", isAuthenticated, addNewProject)
router.delete("/projects/:id", isAuthenticated, delete_All_Projects_SubSections)
router.delete("/project/:id", isAuthenticated, deleteProject)
router.delete("/projects/subSection/:subId/:mainId", isAuthenticated, deleteSubSection)
//  End Projects  //

//  Start Informations  //
router.get("/informations", isAuthenticated, getAllInformations)
router.put("/informations", isAuthenticated, editInformations)
//  End Informations  //

//  Start Message  //
router.post("/message", isAuthenticated, message)
router.delete("/message/:id", isAuthenticated, deleteOne)
router.delete("/message/delete-all", isAuthenticated, deleteAll)
//  End Message  //
export default router;