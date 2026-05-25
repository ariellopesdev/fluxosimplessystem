const { body } = require("express-validator");

const appointmentCreateValidation = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("O título do agendamento é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O título precisa ter no mínimo 3 caracteres."),

    body("date")
      .notEmpty()
      .withMessage("A data do agendamento é obrigatória.")
      .isISO8601()
      .withMessage("Data inválida."),

    body("startTime")
      .trim()
      .notEmpty()
      .withMessage("O horário inicial é obrigatório."),

    body("endTime").optional().trim(),

    body("type")
      .optional()
      .isIn(["DELIVERY", "MEETING", "SERVICE", "FOLLOW_UP", "PAYMENT", "OTHER"])
      .withMessage("Tipo de agendamento inválido."),

    body("status")
      .optional()
      .isIn(["PENDING", "CONFIRMED", "FINISHED", "CANCELLED"])
      .withMessage("Status inválido."),

    body("priority")
      .optional()
      .isIn(["LOW", "MEDIUM", "HIGH"])
      .withMessage("Prioridade inválida."),

    body("contactEmail")
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage("E-mail de contato inválido."),

    body("remindAt")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Data do lembrete inválida."),
  ];
};

const appointmentUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("O título precisa ter no mínimo 3 caracteres."),

    body("date")
      .optional()
      .isISO8601()
      .withMessage("Data inválida."),

    body("startTime").optional().trim(),

    body("endTime").optional().trim(),

    body("type")
      .optional()
      .isIn(["DELIVERY", "MEETING", "SERVICE", "FOLLOW_UP", "PAYMENT", "OTHER"])
      .withMessage("Tipo de agendamento inválido."),

    body("status")
      .optional()
      .isIn(["PENDING", "CONFIRMED", "FINISHED", "CANCELLED"])
      .withMessage("Status inválido."),

    body("priority")
      .optional()
      .isIn(["LOW", "MEDIUM", "HIGH"])
      .withMessage("Prioridade inválida."),

    body("contactEmail")
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage("E-mail de contato inválido."),

    body("remindAt")
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage("Data do lembrete inválida."),
  ];
};

module.exports = {
  appointmentCreateValidation,
  appointmentUpdateValidation,
};