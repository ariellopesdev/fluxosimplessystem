const { query } = require("express-validator");

const dashboardFilterValidation = () => {
  return [
    query("period")
      .optional()
      .isIn(["TODAY", "LAST_7_DAYS", "LAST_30_DAYS", "CURRENT_MONTH", "CUSTOM"])
      .withMessage("Período do dashboard inválido."),

    query("startDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Data inicial inválida."),

    query("endDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Data final inválida."),

    query("startDate").custom((value, { req }) => {
      if (
        req.query.period === "CUSTOM" &&
        (!req.query.startDate || !req.query.endDate)
      ) {
        throw new Error(
          "Informe data inicial e final para período personalizado.",
        );
      }

      return true;
    }),

    query("endDate").custom((value, { req }) => {
      if (
        req.query.startDate &&
        req.query.endDate &&
        new Date(req.query.endDate) < new Date(req.query.startDate)
      ) {
        throw new Error("A data final não pode ser menor que a data inicial.");
      }

      return true;
    }),
  ];
};

module.exports = {
  dashboardFilterValidation,
};