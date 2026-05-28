const { body } = require("express-validator");

const validCategories = [
  "SERVICE",
  "CONSULTATION",
  "INSTALLATION",
  "MAINTENANCE",
  "DELIVERY",
  "SUPPORT",
  "OTHER",
];

const validStatus = ["ACTIVE", "INACTIVE"];

const validDurationUnits = ["MINUTES", "HOURS", "DAYS"];

const serviceCreateValidation = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("O nome do serviço é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),

    body("unityPrice")
      .trim()
      .notEmpty()
      .withMessage("O preço do serviço é obrigatório.")
      .isFloat({ gt: 0 })
      .withMessage("O preço do serviço precisa ser maior que zero."),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("A descrição é muito longa."),

    body("estimatedDurationValue")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("A duração estimada precisa ser maior que zero."),

    body("estimatedDurationUnit")
      .optional()
      .isIn(validDurationUnits)
      .withMessage("Unidade de duração inválida."),

    body("category")
      .optional()
      .isIn(validCategories)
      .withMessage("Categoria inválida."),

    body("status")
      .optional()
      .isIn(validStatus)
      .withMessage("Status inválido."),

    body("isSchedulable")
      .optional()
      .isBoolean()
      .withMessage("Valor inválido para agendamento."),

    body("isSellable")
      .optional()
      .isBoolean()
      .withMessage("Valor inválido para venda."),

    body("requiresClient")
      .optional()
      .isBoolean()
      .withMessage("Valor inválido para exigência de cliente."),
  ];
};

const serviceUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),

    body("unityPrice")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("O preço do serviço precisa ser maior que zero."),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("A descrição é muito longa."),

    body("estimatedDurationValue")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("A duração estimada precisa ser maior que zero."),

    body("estimatedDurationUnit")
      .optional()
      .isIn(validDurationUnits)
      .withMessage("Unidade de duração inválida."),

    body("category")
      .optional()
      .isIn(validCategories)
      .withMessage("Categoria inválida."),

    body("status")
      .optional()
      .isIn(validStatus)
      .withMessage("Status inválido."),

    body("isSchedulable")
      .optional()
      .isBoolean()
      .withMessage("Valor inválido para agendamento."),

    body("isSellable")
      .optional()
      .isBoolean()
      .withMessage("Valor inválido para venda."),

    body("requiresClient")
      .optional()
      .isBoolean()
      .withMessage("Valor inválido para exigência de cliente."),
  ];
};

module.exports = {
  serviceCreateValidation,
  serviceUpdateValidation,
};