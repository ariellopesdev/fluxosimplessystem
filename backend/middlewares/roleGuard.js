const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    //Check if there is an authenticated user
    if (!req.user) {
      return res.status(401).json({
        errors: ["Acesso negado!"],
      });
    }

    //Check if user has permission
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        errors: ["Você não tem permissão para realizar essa ação!"],
      });
    }

    next();
  };
};

module.exports = roleGuard;
