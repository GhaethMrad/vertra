import fs from "fs";
import path from "path";
import MainCategoryModel from "../../models/project/MainCategory.model.js";
import SubcategoryModel from "../../models/project/Subcategory.model.js";
import ProjectModel from "../../models/project/Project.model.js";

const __dirname = path.resolve();

export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find().populate({
      path: "subcategory",
      populate: { path: "mainCategory" },
    });

    if (projects.length === 0) {
      return res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectsBySubSection = async (req, res) => {
  try {
    const projects = await ProjectModel.find({
      subcategory: req.params.id,
    }).populate({
      path: "subcategory",
      populate: { path: "mainCategory" },
    });

    if (projects.length === 0) {
      return res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addNewProject = async (req, res) => {
  const newProject = new ProjectModel();
  const uploadDir = path.join(__dirname, "public", "uploads", "projects");

  try {
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const { title, description, subcategory } = req.body;
    newProject.title = title;
    newProject.description = description;
    newProject.subcategory = subcategory;

    if (req.files && req.files.img) {
      const img = req.files.img;

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(img.mimetype)) {
        throw new Error("نوع الملف غير مسموح به");
      }

      // Validate file size (3MB max)
      if (img.size > 3 * 1024 * 1024) {
        throw new Error("حجم الملف كبير جداً");
      }

      const filename = `${Date.now()}_${img.name}`;
      const filePath = path.join(uploadDir, filename);
      await img.mv(filePath);
      newProject.img = `/uploads/projects/${filename}`;
      newProject.mimetype = img.mimetype;
    }

    await newProject.save();
    res.status(201).redirect("/projects?done");
  } catch (error) {
    console.error("خطأ في إضافة المشروع:", error);
    res.status(400).json({
      success: false,
      message: error.message || "حدث خطأ أثناء إضافة المشروع",
    });
  }
};

export const addProjectsSections = async (req, res) => {
  const uploadDir = path.join(__dirname, "public", "uploads", "projects");

  try {
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Main Section
    const mainCategory = new MainCategoryModel();
    mainCategory.name = req.body.mainSectionName;

    if (req.files && req.files.mainSectionImage) {
      const mainImage = req.files.mainSectionImage;

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(mainImage.mimetype)) {
        throw new Error("نوع الملف غير مسموح به");
      }

      // Validate file size
      if (mainImage.size > 3 * 1024 * 1024) {
        throw new Error("حجم الملف كبير جداً");
      }

      const filename = `${Date.now()}_${mainImage.name}`;
      const filePath = path.join(uploadDir, filename);
      await mainImage.mv(filePath);
      mainCategory.img = `/uploads/projects/${filename}`;
    }

    await mainCategory.save();

    // Sub Sections
    if (req.body.sectionName && req.files && req.files.img) {
      const subcategories = req.body.sectionName;
      const reqSubImages = Array.isArray(req.files.img)
        ? req.files.img
        : [req.files.img];

      const subcategoryDocs = await Promise.all(
        subcategories.map(async (name, index) => {
          if (index < reqSubImages.length) {
            const image = reqSubImages[index];

            // Validate file type
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(image.mimetype)) {
              throw new Error(`نوع الملف غير مسموح به للصورة ${index + 1}`);
            }

            // Validate file size
            if (image.size > 3 * 1024 * 1024) {
              throw new Error(`حجم الملف كبير جداً للصورة ${index + 1}`);
            }

            const filename = `${Date.now()}_${image.name}`;
            const filePath = path.join(uploadDir, filename);
            await image.mv(filePath);

            return {
              name,
              img: `/uploads/projects/${filename}`,
              mainCategory: mainCategory._id,
            };
          }
          return null;
        })
      );

      const validSubcategories = subcategoryDocs.filter((doc) => doc !== null);
      if (validSubcategories.length > 0) {
        await SubcategoryModel.insertMany(validSubcategories);
      }
    }

    res.status(201).redirect("/projects?done");
  } catch (error) {
    console.error("خطأ في إضافة أقسام المشروع:", error);
    res.status(400).json({
      success: false,
      message: error.message || "حدث خطأ أثناء إضافة أقسام المشروع",
    });
  }
};

export const addSubSection = async (req, res) => {
  const subSection = new SubcategoryModel();
  const uploadDir = path.join(__dirname, "public", "uploads", "projects");

  try {
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    subSection.name = req.body.name;
    subSection.mainCategory = req.params.id;

    if (req.files && req.files.img) {
      const img = req.files.img;

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(img.mimetype)) {
        throw new Error("نوع الملف غير مسموح به");
      }

      // Validate file size
      if (img.size > 3 * 1024 * 1024) {
        throw new Error("حجم الملف كبير جداً");
      }

      const filename = `${Date.now()}_${img.name}`;
      const filePath = path.join(uploadDir, filename);
      await img.mv(filePath);
      subSection.img = `/uploads/projects/${filename}`;
    }

    await subSection.save();
    res.status(201).redirect(`/projects/subSections/${req.params.id}?done`);
  } catch (error) {
    console.error("خطأ في إضافة القسم الفرعي:", error);
    res.status(400).json({
      success: false,
      message: error.message || "حدث خطأ أثناء إضافة القسم الفرعي",
    });
  }
};

function deleteFileIfExists(filePath) {
  const fullPath = path.join(__dirname, "public", filePath); // تأكد من المسار
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

export const delete_All_Projects_SubSections = async (req, res) => {
  try {
    const mainSection = await MainCategoryModel.findById(req.params.id);
    if (!mainSection) {
      return res.status(404).json({ message: "Main section not found" });
    }

    const subSections = await SubcategoryModel.find({
      mainCategory: req.params.id,
    });
    const subSectionIds = subSections.map((sub) => sub._id);
    const projects = await ProjectModel.find({
      subcategory: { $in: subSectionIds },
    });
    if (projects) {
      projects.forEach((project) => {
        deleteFileIfExists(project.img);
      });
      await ProjectModel.deleteMany({ subcategory: { $in: subSectionIds } });
    }
    if (subSections) {
      subSections.forEach((section) => {
        deleteFileIfExists(section.img);
      });
      await SubcategoryModel.deleteMany({ mainCategory: req.params.id });
    }
    deleteFileIfExists(mainSection.img);
    await mainSection.deleteOne();
    res.status(200).redirect("/projects?done");
  } catch (error) {
    console.error("خطأ في حذف المشروع وأقسامه:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء حذف المشروع وأقسامه",
    });
  }
};

export const deleteSubSection = async (req, res) => {
  const subSection = await SubcategoryModel.findById(req.params.subId);
  const projects = await ProjectModel.find({ subcategory: req.params.subId });

  try {
    deleteFileIfExists(subSection.img);
    if (projects) {
      projects.forEach(async (project) => {
        deleteFileIfExists(project.img);
        await project.deleteOne();
      });
    }
    await subSection.deleteOne();
    res.status(200).redirect(`/projects/subSections/${req.params.mainId}?done`);
  } catch (error) {
    console.error("خطأ في حذف القسم الفرعي:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء حذف القسم الفرعي",
    });
  }
};

export const deleteProject = async (req, res) => {
  const project = await ProjectModel.findById(req.params.id);

  try {
    deleteFileIfExists(project.img);
    await project.deleteOne();
    res.status(200).redirect(`/projects/${project.subcategory}?done`);
  } catch (error) {
    console.error("خطأ في حذف المشروع:", error);
    res.status(500).json({
      success: false,
      message: error.message || "حدث خطأ أثناء حذف المشروع",
    });
  }
};
