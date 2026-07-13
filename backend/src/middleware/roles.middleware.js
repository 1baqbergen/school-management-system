module.exports = function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Авторизация қажет"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Сізде бұл ресурсқа рұқсат жоқ",
        yourRole: req.user.role
      });
    }

    next();
  };
};
