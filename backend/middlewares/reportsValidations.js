const { body } = require("express-validator");

const reportGenerateValidation = () => {
  return [
    body("type")
      .optional()
      .isIn([
        "FINANCIAL",
        "SALES",
        "PRODUCTS",
        "CLIENTS",
        "APPOINTMENTS",
        "SERVICES",
        "GENERAL",
      ])
      .withMessage("Tipo de relatório inválido."),

    body("period")
      .optional()
      .isIn([
        "LAST_7_DAYS",
        "LAST_30_DAYS",
        "CURRENT_MONTH",
        "CUSTOM",
      ])
      .withMessage("Período de relatório inválido."),

    body("startDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Data inicial inválida."),

    body("endDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Data final inválida."),

    body("title")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("O título deve possuir entre 3 e 100 caracteres."),

    body("notes")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 1000 })
      .withMessage("As observações devem ter no máximo 1000 caracteres."),

    body("startDate").custom((value, { req }) => {
      if (
        req.body.period === "CUSTOM" &&
        (!req.body.startDate || !req.body.endDate)
      ) {
        throw new Error(
          "Informe data inicial e final para período personalizado.",
        );
      }

      return true;
    }),

    body("endDate").custom((value, { req }) => {
      if (
        req.body.startDate &&
        req.body.endDate &&
        new Date(req.body.endDate) < new Date(req.body.startDate)
      ) {
        throw new Error(
          "A data final não pode ser menor que a data inicial.",
        );
      }

      return true;
    }),
  ];
};

module.exports = {
  reportGenerateValidation,
};