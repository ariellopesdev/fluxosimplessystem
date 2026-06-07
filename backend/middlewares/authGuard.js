const User = require("../models/User");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ errors: ["Acesso negado."] });
  }

  try {
    const verified = jwt.verify(token, jwtSecret);

    const user = await User.findById(verified.id)
      .select("-password")
      .populate("company");

    if (!user) {
      return res.status(401).json({
        errors: ["Usuário não encontrado."],
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      errors: ["Sessão inválida ou servidor indisponível."],
    });
  }
};

module.exports = authGuard;