const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("Nome deve ter pelo menos 3 caracteres."),
    body("email")
      .trim()
      .normalizeEmail()
      .notEmpty()
      .isString()
      .withMessage("E-mail é obrigatório.")
      .isEmail()
      .withMessage("E-mail inválido."),
    body("password")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Senha é obrigatória.")
      .isLength({ min: 6 })
      .withMessage("Senha precisa ter no mínimo 6 caracteres."),
    body("confirmPassword")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Confirmação de senha é obrigatório.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas não coincidem.");
        }
        return true;
      }),
    body("companyName")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Nome da empresa é obrigatório.")
      .isLength({ min: 2 })
      .withMessage("Nome da empresa muito curto."),
    body("cnpj")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("CNPJ da empresa é obrigatório.")
      .isLength({ min: 14, max: 14 })
      .withMessage("CNPJ deve ter 14 dígitos.")
      .isNumeric()
      .withMessage("CNPJ deve conter apenas números."),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .trim()
      .normalizeEmail()
      .notEmpty()
      .isString()
      .withMessage("E-mail é obrigatório.")
      .isEmail()
      .withMessage("E-mail inválido."),
    body("password")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("A senha é obrigatória."),
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Nome precisa de pelo menos 3 caracteres."),
    body("password")
      .optional()
      .trim()
      .isLength({ min: 6 })
      .withMessage("Senha precisa ter no mínimo 6 caracteres."),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
