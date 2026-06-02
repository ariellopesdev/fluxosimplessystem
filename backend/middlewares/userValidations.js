const { body } = require("express-validator");
const { isValidCNPJ } = require("../utils/validators");

const userCreateValidation = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("O nome é obrigatório.")
      .isString()
      .withMessage("Nome inválido.")
      .isLength({ min: 3 })
      .withMessage("O nome deve ter no mínimo 3 caracteres."),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail inválido."),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 6 })
      .withMessage("A senha precisa ter no mínimo 6 caracteres.")
      .matches(/[A-Z]/)
      .withMessage("A senha deve conter ao menos uma letra maiúscula.")
      .matches(/[a-z]/)
      .withMessage("A senha deve conter ao menos uma letra minúscula.")
      .matches(/[0-9]/)
      .withMessage("A senha deve conter ao menos um número."),

    body("confirmPassword")
      .trim()
      .notEmpty()
      .withMessage("A confirmação de senha é obrigatória.")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("As senhas não coincidem.");
        }

        return true;
      }),

    body("companyName")
      .trim()
      .notEmpty()
      .withMessage("O nome da empresa é obrigatório.")
      .isLength({ min: 2 })
      .withMessage("O nome da empresa deve ter no mínimo 2 caracteres."),

    body("cnpj")
      .trim()
      .notEmpty()
      .withMessage("O CNPJ da empresa é obrigatório.")
      .custom((value) => {
        if (!isValidCNPJ(value)) {
          throw new Error("CNPJ inválido.");
        }

        return true;
      }),

    body("role")
      .optional()
      .isIn(["USER", "ADMIN"])
      .withMessage("Tipo de usuário inválido."),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("E-mail inválido."),

    body("password").trim().notEmpty().withMessage("A senha é obrigatória."),
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("O nome deve ter no mínimo 3 caracteres."),

    body("email").optional().trim().isEmail().withMessage("E-mail inválido."),

    body("password")
      .optional()
      .trim()
      .isLength({ min: 6 })
      .withMessage("A senha precisa ter no mínimo 6 caracteres.")
      .matches(/[A-Z]/)
      .withMessage("A senha deve conter ao menos uma letra maiúscula.")
      .matches(/[a-z]/)
      .withMessage("A senha deve conter ao menos uma letra minúscula.")
      .matches(/[0-9]/)
      .withMessage("A senha deve conter ao menos um número."),

    body("companyName")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("O nome da empresa deve ter no mínimo 2 caracteres."),

    body("cnpj")
      .optional()
      .trim()
      .custom((value) => {
        if (value && !isValidCNPJ(value)) {
          throw new Error("CNPJ inválido.");
        }

        return true;
      }),

    body("role")
      .optional()
      .isIn(["USER", "ADMIN"])
      .withMessage("Tipo de usuário inválido."),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
