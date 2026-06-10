const { body, query } = require("express-validator");

const supportCreateValidation = () => {
  return [
    body("subject")
      .trim()
      .notEmpty()
      .withMessage("O assunto é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O assunto precisa ter no mínimo 3 caracteres.")
      .isLength({ max: 120 })
      .withMessage("O assunto pode ter no máximo 120 caracteres."),

    body("category")
      .optional()
      .isIn([
        "ACCOUNT",
        "PRODUCTS",
        "CLIENTS",
        "SERVICES",
        "APPOINTMENTS",
        "FINANCIAL",
        "REPORTS",
        "DASHBOARD",
        "SETTINGS",
        "BUG",
        "OTHER",
      ])
      .withMessage("Categoria inválida."),

    body("priority")
      .optional()
      .isIn(["LOW", "MEDIUM", "HIGH"])
      .withMessage("Prioridade inválida."),

    body("message")
      .trim()
      .notEmpty()
      .withMessage("A mensagem é obrigatória.")
      .isLength({ min: 5 })
      .withMessage("A mensagem precisa ter no mínimo 5 caracteres.")
      .isLength({ max: 2000 })
      .withMessage("A mensagem pode ter no máximo 2000 caracteres."),
  ];
};

const supportMessageValidation = () => {
  return [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("A mensagem é obrigatória.")
      .isLength({ min: 2 })
      .withMessage("A mensagem precisa ter no mínimo 2 caracteres.")
      .isLength({ max: 2000 })
      .withMessage("A mensagem pode ter no máximo 2000 caracteres."),
  ];
};

const supportStatusValidation = () => {
  return [
    body("status")
      .notEmpty()
      .withMessage("O status é obrigatório.")
      .isIn(["OPEN", "IN_PROGRESS", "ANSWERED", "CLOSED", "CANCELED"])
      .withMessage("Status inválido."),
  ];
};

const supportFilterValidation = () => {
  return [
    query("status")
      .optional()
      .isIn(["OPEN", "IN_PROGRESS", "ANSWERED", "CLOSED", "CANCELED"])
      .withMessage("Status inválido."),

    query("category")
      .optional()
      .isIn([
        "ACCOUNT",
        "PRODUCTS",
        "CLIENTS",
        "SERVICES",
        "APPOINTMENTS",
        "FINANCIAL",
        "REPORTS",
        "DASHBOARD",
        "SETTINGS",
        "BUG",
        "OTHER",
      ])
      .withMessage("Categoria inválida."),

    query("priority")
      .optional()
      .isIn(["LOW", "MEDIUM", "HIGH"])
      .withMessage("Prioridade inválida."),
  ];
};

module.exports = {
  supportCreateValidation,
  supportMessageValidation,
  supportStatusValidation,
  supportFilterValidation,
};
