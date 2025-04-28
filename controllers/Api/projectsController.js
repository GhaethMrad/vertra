import fs from "fs";
import path from "path";
import MainCategoryModel from "../../models/project/MainCategory.model.js";
import SubcategoryModel from "../../models/project/Subcategory.model.js";
import ProjectModel from "../../models/project/Project.model.js";

const __dirname = path.resolve();

export const getAllProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find().populate({
            path: 'subcategory',
            populate: { path: 'mainCategory' }
        });
        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getProjectsBySubSection = async (req, res) => {
    try {
        const projects = await ProjectModel.find({subcategory: req.params.id}).populate({
            path: 'subcategory',
            populate: { path: 'mainCategory' }
        });
        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const addNewProject = async (req, res) => {
    const newProject = new ProjectModel();
    try {
        const uploadDir = path.join(__dirname, "public", "uploads", "projects")
        const {title, description, subcategory} = req.body;
        newProject.title = title;
        newProject.description = description;
        newProject.subcategory = subcategory;
        const img = req.files.img;
        newProject.mimetype = img.mimetype;
        const filename = `${Date.now()}_${img.name}`;
        const filePath = path.join(uploadDir, filename);
        await img.mv(filePath);
        newProject.img = `/uploads/projects/${filename}`
        await newProject.save();
        res.status(201).redirect("/projects?done")
    } catch (error) {
        res.json({message: error.message})
    }
}

export const addProjectsSections = async (req, res) => {
    try {
        // Main Section
        const mainCategory = new MainCategoryModel();
        mainCategory.name = req.body.mainSectionName;
        const uploadDir = path.join(__dirname, "public", "uploads", "projects");
        const mainImage = req.files.mainSectionImage;
        const filename = `${Date.now()}_${mainImage.name}`;
        const filePath = path.join(uploadDir, filename);
        await mainImage.mv(filePath);
        mainCategory.img = `/uploads/projects/${filename}`
        await mainCategory.save();
        // Main Section

        // Sub Sections
        const subcategories = req.body.sectionName;
        const reqSubImages = (Array.isArray(req.files.img) ? req.files.img : [req.files.img]);
        const subcategoryDocs = await Promise.all(
        subcategories.map(async (name, index) => {
            const filename = `${Date.now()}_${reqSubImages[index].name}`;
            const filePath = path.join(uploadDir, filename);
            await reqSubImages[index].mv(filePath);
        
            return {
            name,
            img: `/uploads/projects/${filename}`,
            mainCategory: mainCategory._id
            };
        })
        );
        await SubcategoryModel.insertMany(subcategoryDocs)
        res.status(201).redirect("/projects?done")
        // Sub Sections
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const addSubSection = async (req, res) => {
    const subSection = new SubcategoryModel()
    try {
        const uploadDir = path.join(__dirname, "public", "uploads", "projects")
        subSection.name = req.body.name;
        const img = req.files.img;
        const filename = `${Date.now()}_${img.name}`;
        const filePath = path.join(uploadDir, filename);
        await img.mv(filePath);
        subSection.img = `/uploads/projects/${filename}`
        subSection.mainCategory = req.params.id
        await subSection.save();
        res.status(201).redirect(`/projects/subSections/${req.params.id}?done`);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

function deleteFileIfExists(filePath) {
    const fullPath = path.join(__dirname, 'public', filePath); // تأكد من المسار
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
}

export const delete_All_Projects_SubSections = async (req, res) => {
    try {
        const mainSection = await MainCategoryModel.findById(req.params.id);
        const subSections = await SubcategoryModel.find({mainCategory: req.params.id});
        const subSectionIds = subSections.map((sub) => sub._id);
        const projects = await ProjectModel.find({subcategory: {$in: subSectionIds}})
        if (projects) {
            projects.forEach((project) => {
                deleteFileIfExists(project.img)
            })
            await ProjectModel.deleteMany({subcategory: {$in: subSectionIds}})
        }
        if (subSections) {
            subSections.forEach((section) => {
                deleteFileIfExists(section.img)
            })
            await SubcategoryModel.deleteMany({mainCategory: req.params.id})
        }
        deleteFileIfExists(mainSection.img);
        await mainSection.deleteOne();
        res.status(200).redirect("/projects?done")
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const deleteSubSection = async (req, res) => {
    const subSection = await SubcategoryModel.findById(req.params.subId);
    const projects = await ProjectModel.find({subcategory: req.params.subId})

    try {
        deleteFileIfExists(subSection.img)
        if (projects) {
            projects.forEach(async (project) => {
                deleteFileIfExists(project.img);
                await project.deleteOne();
            })
        }
        await subSection.deleteOne();
        res.status(200).redirect(`/projects/subSections/${req.params.mainId}?done`)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const deleteProject = async (req, res) => {
    const project = await ProjectModel.findById(req.params.id);
    
    try {
        deleteFileIfExists(project.img);
        await project.deleteOne();
        res.status(200).redirect(`/projects/${project.subcategory}?done`)
    } catch (error) {
        res.json({message: error.message})
    }
}