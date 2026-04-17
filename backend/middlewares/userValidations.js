const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome do usuário é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome do usuário precisa ter no mínimo 3 caracteres."),
    body("email")
      .isString()
      .withMessage("O campo e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido."),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 6 })
      .withMessage("A senha precisa ter no mínimo 6 caracteres."),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação de senha é obrigatória.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas não são iguais.");
        }
        return true;
      }),
    body("companyName")
      .isString()
      .withMessage("O nome da empresa é obrigatório."),
    body("cnpj")
      .isString()
      .withMessage("O CNPJ da empresa é obrigatório.")
      .isLength({ min: 14, max: 14 })
      .withMessage("O CNPJ deve conter exatamente 14 caracteres."),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O campo e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido."),
    body("password").isString().withMessage("A senha é obrigatória."),
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome precisa de pelo menos 3 caracteres."),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("A senha precisa ter no mínimo 6 caracteres"),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
