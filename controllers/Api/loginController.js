import AdminModel from "../../models/Admin.model.js";

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const admin = await AdminModel.findOne({ username });
      if (!admin) {
        return res.status(400).redirect("/login?error");
      }
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).redirect("/login?error");
      }
      // حفظ بيانات الادمن في الجلسة
      req.session.adminId = admin._id;
      req.session.role = 'admin';
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('خطأ في الخادم.');
    }
}