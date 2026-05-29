const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errors: [
      "Muitas tentativas de login. Aguarde 15 minutos e tente novamente.",
    ],
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errors: [
      "Muitas solicitações de recuperação de senha. Aguarde 15 minutos e tente novamente.",
    ],
  },
});

module.exports = {
  loginLimiter,
  forgotPasswordLimiter,
};