import ServiceModel from "../../models/Service.model.js";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

export const getAllServices = async (req, res) => {
  const services = await ServiceModel.find();

  try {
    if (services.length == 0) {
      return res.status(404).json({ message: "Not Found" });
    }
    res.status(200).json(services);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getServicesByTitle = async (req, res) => {
  try {
    const searchQuery = req.query.title;

    const data = await ServiceModel.find({
      $or: [{ serviceName: { $regex: searchQuery, $options: "i" } }],
    });

    res.status(200).render("layout.ejs", {
      title: "Services",
      page: "pages/services/allServices.ejs",
      pageName: "Services Page",
      data,
      searchQuery,
    });
  } catch (error) {
    res.status(500).send("حدث خطأ أثناء البحث");
  }
};

export const addService = async (req, res) => {
  const service = new ServiceModel();
  const newSection = [];
  const uploadDir = path.join(process.cwd(), "public", "uploads", "services");

  try {
    // التحقق من وجود المجلد وإنشائه إذا لم يكن موجوداً
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    service.serviceName = req.body.serviceName;

    // معالجة الصورة الرئيسية
    if (req.files.serviceImage) {
      const img = req.files.serviceImage;

      // التحقق من نوع الملف
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(img.mimetype)) {
        throw new Error("نوع الملف غير مسموح به");
      }

      // التحقق من حجم الملف (5MB كحد أقصى)
      if (img.size > 3 * 1024 * 1024) {
        throw new Error("حجم الملف كبير جداً");
      }

      const filename = `${Date.now()}_${img.name}`;
      const filePath = path.join(uploadDir, filename);

      await img.mv(filePath);
      service.serviceImage = `/uploads/services/${filename}`;
    }

    // معالجة الصور المتعددة
    if (req.files && req.files.img) {
      const images = Array.isArray(req.files.img)
        ? req.files.img
        : [req.files.img];

      // معالجة جميع الصور بشكل متزامن
      await Promise.all(
        images.map(async (image, index) => {
          // التحقق من نوع الملف
          const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
          if (!allowedTypes.includes(image.mimetype)) {
            throw new Error(`نوع الملف غير مسموح به للصورة ${index + 1}`);
          }

          // التحقق من حجم الملف
          if (image.size > 3 * 1024 * 1024) {
            throw new Error(`حجم الملف كبير جداً للصورة ${index + 1}`);
          }

          const filename = `${Date.now()}_${image.name}`;
          const filePath = path.join(uploadDir, filename);

          await image.mv(filePath);

          newSection.push({
            title: req.body.title[index],
            img: `/uploads/services/${filename}`,
            desc: req.body.desc[index],
          });
        })
      );
    }

    service.sections = newSection;
    await service.save();

    // استخدام مسار نسبي للتوجيه
    res.status(201).redirect("/services?done");
  } catch (error) {
    console.error("خطأ في رفع الخدمة:", error);
    res.status(400).json({
      success: false,
      message: error.message || "حدث خطأ أثناء رفع الخدمة",
    });
  }
};

export const editService = async (req, res) => {
  const service = await ServiceModel.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  try {
    service.serviceName = req.body.serviceName || service.serviceName;
    const uploadDir = path.join(__dirname, "public", "uploads", "services");

    if (req.files && req.files.serviceImage) {
      const img = req.files.serviceImage;

      if (service.serviceImage) {
        const oldImagePath = path.join(
          __dirname,
          "public",
          service.serviceImage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const filename = `${Date.now()}_${img.name}`;
      const filePath = path.join(uploadDir, filename);

      await img.mv(filePath);

      service.serviceImage = `/uploads/services/${filename}`;
    }

    if (req.files && req.files.img) {
      let sectionsImages = req.files.img;
      const imagesArray = Array.isArray(sectionsImages)
        ? sectionsImages
        : [sectionsImages];

      await Promise.all(
        service.sections.map(async (section, index) => {
          if (section.img && imagesArray[index]) {
            const oldImagePath = path.join(__dirname, "public", section.img);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
        })
      );

      await Promise.all(
        imagesArray.map(async (image, index) => {
          const filename = `${Date.now()}_${image.name}`;
          const filePath = path.join(uploadDir, filename);
          await image.mv(filePath);
          service.sections[index].img = `/uploads/services/${filename}`;
        })
      );
    }

    if (req.body.title && req.body.title.length > 0) {
      req.body.title.forEach((ele, index) => {
        service.sections[index].title = ele;
      });
    } else {
      service.sections = service.sections;
    }
    if (req.body.desc && req.body.desc.length > 0) {
      req.body.desc.forEach((ele, index) => {
        service.sections[index].desc = ele;
      });
    } else {
      service.sections = service.sections;
    }

    await service.save();

    res.status(200).redirect("/services?done");
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const editServiceSection = async (req, res) => {
  const service = await ServiceModel.findById(req.params.id);
  const section = service.sections.find((ele) => {
    return ele.id == req.params.sectionId;
  });
  try {
    section.title = req.body.title || section.title;
    section.desc = req.body.desc || section.desc;

    if (req.files && req.files.img) {
      const img = req.files.img;
      const imagePath = path.join(__dirname, "public", section.img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      const uploadDir = path.join(__dirname, "public", "uploads", "services");
      const filename = `${Date.now()}_${img.name}`;
      const filePath = path.join(uploadDir, filename);

      section.img = `/uploads/services/${filename}`;

      await img.mv(filePath);
    }

    await service.save();
    res.redirect(`/services/${service._id}/sections?done`);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (service.serviceImage) {
      const imagePath = path.join(__dirname, "public", service.serviceImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    if (service.sections) {
      service.sections.forEach((ele) => {
        if (ele.img) {
          const imagePath = path.join(__dirname, "public", ele.img);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      });
    }
    await service.deleteOne();
    res.status(200).redirect("/services?done");
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};
