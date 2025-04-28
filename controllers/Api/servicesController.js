import ServiceModel from "../../models/Service.model.js";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

export const getAllServices = async (req, res) => {
    const services = await ServiceModel.find();

    try {
        if (services.length == 0) {
            return res.status(404).json({message: "Not Found"})
        }
        res.status(200).json(services)
    } catch (error) {
        res.json({message: error.message})
    }
}

export const getServicesByTitle = async (req, res) => {
    try {
        const searchQuery = req.query.title;
        
        const data = await ServiceModel.find({
            $or: [
            { serviceName: { $regex: searchQuery, $options: 'i' } },
            ]
        });

        res.status(200).render('layout.ejs', {
            title: "Services",
            page: "pages/services/allServices.ejs",
            pageName: "Services Page",
            data,
            searchQuery
        });
    
    } catch (error) {
        res.status(500).send('حدث خطأ أثناء البحث');
    }
}

export const addService = async (req, res) => {
    const service = new ServiceModel();
    const newSection = [];

    try {
        service.serviceName = req.body.serviceName;
        const uploadDir = path.join(__dirname, 'public', 'uploads', 'services');
        if (req.files.serviceImage) {
            const img = req.files.serviceImage;

            const filename = `${Date.now()}_${img.name}`;
            const filePath = path.join(uploadDir, filename);

            await img.mv(filePath);

            service.serviceImage = `/uploads/services/${filename}`
        }
        if (req.files && req.files.img) {
            const img = (req.files.img.length > 0) ? [...req.files.img] : [req.files.img];

            img.forEach(async (image, index) => {
                const filename = `${Date.now()}_${image.name}`;
                const filePath = path.join(uploadDir, filename);
    
                newSection.push({
                    title: req.body.title[index],
                    img: `/uploads/services/${filename}`,
                    desc: req.body.desc[index]
                }) 
    
                await image.mv(filePath)
            })
        }
        service.sections = newSection
        await service.save();

        res.status(201).redirect("/services?done")
    } catch (error) {
        console.log(error)
        res.json({message: error.message});
    }
}

export const editService = async (req, res) => {
    const service = await ServiceModel.findById(req.params.id);
    
    if (!service) {
        return res.status(404).json({ message: "Service not found" });
    }

    try {
        service.serviceName = req.body.serviceName || service.serviceName;
        const uploadDir = path.join(__dirname, 'public', 'uploads', 'services');

        if (req.files && req.files.serviceImage) {
            const img = req.files.serviceImage;

            if (service.serviceImage) {
                const oldImagePath = path.join(__dirname, 'public', service.serviceImage);
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
            const imagesArray = Array.isArray(sectionsImages) ? sectionsImages : [sectionsImages];

            await Promise.all(service.sections.map(async (section, index) => {
                if (section.img && imagesArray[index]) {
                  const oldImagePath = path.join(__dirname, 'public', section.img);
                  if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                  }
                }
            }));
            
            await Promise.all(imagesArray.map(async (image, index) => {
                const filename = `${Date.now()}_${image.name}`;
                const filePath = path.join(uploadDir, filename);
                await image.mv(filePath);
                service.sections[index].img = `/uploads/services/${filename}`;
            }));
        }
       
        if (req.body.title && req.body.title.length > 0) {
            req.body.title.forEach((ele, index) => {
                service.sections[index].title = ele
            })
        } else {
            service.sections = service.sections    
        }
        if (req.body.desc && req.body.desc.length > 0) {
            req.body.desc.forEach((ele, index) => {
                service.sections[index].desc = ele
            })
        } else {
            service.sections = service.sections    
        }

        await service.save();

        res.status(200).redirect("/services?done");
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const editServiceSection = async (req, res) => {
    const service = await ServiceModel.findById(req.params.id);
    const section = service.sections.find((ele) => {
        return ele.id == req.params.sectionId;
    })
    try {
        section.title = req.body.title || section.title;
        section.desc = req.body.desc || section.desc;

        if (req.files && req.files.img) {
            const img = req.files.img;
            const imagePath = path.join(__dirname, "public", section.img);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
            const uploadDir = path.join(__dirname, 'public', 'uploads', 'services');
            const filename = `${Date.now()}_${img.name}`;
            const filePath = path.join(uploadDir, filename);

            section.img = `/uploads/services/${filename}`

            await img.mv(filePath)
        }

        await service.save()
        res.redirect(`/services/${service._id}/sections?done`)
    } catch (error) {
        console.log(error)
        res.json({message: error.message});
    }
}

export const deleteService = async (req, res) => {
    try {
        const service = await ServiceModel.findById(req.params.id);
        if (service.serviceImage) {
            const imagePath = path.join(__dirname, "public", service.serviceImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }
        if (service.sections) {
            service.sections.forEach((ele) => {
                if (ele.img) {
                    const imagePath = path.join(__dirname, "public", ele.img);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath)
                    }
                }
            })
        }
        await service.deleteOne();
        res.status(200).redirect("/services?done")
    } catch (error) {
        console.log(error);
        res.json({message: error.message})
    }
}