import AdminModel from "../models/Admin.model.js";

export const createAdminIfNotExists = async () => {
    const existingAdmin = await AdminModel.countDocuments();
    if (existingAdmin == 0) {
      const newAdmin = new AdminModel({ username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD });
      await newAdmin.save();
      console.log('تم إنشاء مستخدم ادمن جديد.');
    }
};