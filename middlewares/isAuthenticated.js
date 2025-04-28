export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.adminId && req.session.role === 'admin') {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
};