const { body } = require("express-validator");

const clientCreateValidation = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("O nome do cliente é obrigatório.")
      .isLength({ min: 3 })
      .withMessage(
        "O nome precisa ter no mínimo 3 caracteres.",
      ),

    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("E-mail inválido."),

    body("primaryPhone")
      .trim()
      .notEmpty()
      .withMessage(
        "O telefone principal é obrigatório.",
      ),

    body("cpfCnpj")
      .optional()
      .trim()
      .isLength({ min: 11 })
      .withMessage(
        "CPF ou CNPJ inválido.",
      ),

    body("type")
      .optional()
      .isIn(["PERSON", "COMPANY"])
      .withMessage("Tipo de cliente inválido."),

    body("financial")
      .optional()
      .isIn(["ACTIVE", "CANCELLED"])
      .withMessage("Status financeiro inválido."),
  ];
};

const clientUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage(
        "O nome precisa ter no mínimo 3 caracteres.",
      ),

    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("E-mail inválido."),

    body("primaryPhone")
      .optional()
      .trim(),

    body("cpfCnpj")
      .optional()
      .trim()
      .isLength({ min: 11 })
      .withMessage(
        "CPF ou CNPJ inválido.",
      ),

    body("type")
      .optional()
      .isIn(["PERSON", "COMPANY"])
      .withMessage("Tipo de cliente inválido."),

    body("financial")
      .optional()
      .isIn(["ACTIVE", "CANCELLED"])
      .withMessage("Status financeiro inválido."),
  ];
};

module.exports = {
  clientCreateValidation,
  clientUpdateValidation,
};