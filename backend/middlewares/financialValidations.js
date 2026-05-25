const { body } = require("express-validator");

const validTypes = ["INCOME", "EXPENSE", "ASSET"];

const validCategories = [
  "SALE",
  "PRODUCT_PURCHASE",
  "PRODUCT_ASSET",
  "COMPANY_ASSET",
  "MAINTENANCE",
  "TAX",
  "SALARY",
  "RENT",
  "UTILITY",
  "OTHER",
];

const validPaymentMethods = [
  "CASH",
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_SLIP",
  "TRANSFER",
];

const validPaymentStatus = ["PENDING", "PAID", "CANCELLED"];

const validRecurrenceFrequency = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
  "NONE",
];

const financialCreateValidation = () => {
  return [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("O título precisa ter no mínimo 3 caracteres."),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("A descrição pode ter no máximo 500 caracteres."),

    body("type")
      .optional()
      .isIn(validTypes)
      .withMessage("Tipo financeiro inválido."),

    body("category")
      .optional()
      .isIn(validCategories)
      .withMessage("Categoria financeira inválida."),

    body("amount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("O valor precisa ser um número maior ou igual a zero."),

    body("payment.method")
      .optional()
      .isIn(validPaymentMethods)
      .withMessage("Método de pagamento inválido."),

    body("payment.status")
      .optional()
      .isIn(validPaymentStatus)
      .withMessage("Status de pagamento inválido."),

    body("payment.installments")
      .optional()
      .isInt({ min: 1 })
      .withMessage("O número de parcelas precisa ser maior ou igual a 1."),

    body("payment.paidAt")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage("A data de pagamento precisa ser válida."),

    body("payment.dueDate")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage("A data de vencimento precisa ser válida."),

    body("origin.sale")
      .optional({ nullable: true, checkFalsy: true })
      .isMongoId()
      .withMessage("Venda de origem inválida."),

    body("origin.product")
      .optional({ nullable: true, checkFalsy: true })
      .isMongoId()
      .withMessage("Produto de origem inválido."),

    body("origin.client")
      .optional({ nullable: true, checkFalsy: true })
      .isMongoId()
      .withMessage("Cliente de origem inválido."),

    body("notes")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("As observações podem ter no máximo 500 caracteres."),

    body("isRecurring")
      .optional()
      .isBoolean()
      .withMessage("Recorrência precisa ser verdadeiro ou falso."),

    body("recurrence.frequency")
      .optional()
      .isIn(validRecurrenceFrequency)
      .withMessage("Frequência de recorrência inválida."),

    body("recurrence.nextDate")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage("A próxima data de recorrência precisa ser válida."),
  ];
};

const financialUpdateValidation = () => {
  return [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("O título precisa ter no mínimo 3 caracteres."),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("A descrição pode ter no máximo 500 caracteres."),

    body("type")
      .optional()
      .isIn(validTypes)
      .withMessage("Tipo financeiro inválido."),

    body("category")
      .optional()
      .isIn(validCategories)
      .withMessage("Categoria financeira inválida."),

    body("amount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("O valor precisa ser um número maior ou igual a zero."),

    body("payment.method")
      .optional()
      .isIn(validPaymentMethods)
      .withMessage("Método de pagamento inválido."),

    body("payment.status")
      .optional()
      .isIn(validPaymentStatus)
      .withMessage("Status de pagamento inválido."),

    body("payment.installments")
      .optional()
      .isInt({ min: 1 })
      .withMessage("O número de parcelas precisa ser maior ou igual a 1."),

    body("payment.paidAt")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage("A data de pagamento precisa ser válida."),

    body("payment.dueDate")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage("A data de vencimento precisa ser válida."),

    body("origin.sale")
      .optional({ nullable: true, checkFalsy: true })
      .isMongoId()
      .withMessage("Venda de origem inválida."),

    body("origin.product")
      .optional({ nullable: true, checkFalsy: true })
      .isMongoId()
      .withMessage("Produto de origem inválido."),

    body("origin.client")
      .optional({ nullable: true, checkFalsy: true })
      .isMongoId()
      .withMessage("Cliente de origem inválido."),

    body("notes")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("As observações podem ter no máximo 500 caracteres."),

    body("isRecurring")
      .optional()
      .isBoolean()
      .withMessage("Recorrência precisa ser verdadeiro ou falso."),

    body("recurrence.frequency")
      .optional()
      .isIn(validRecurrenceFrequency)
      .withMessage("Frequência de recorrência inválida."),

    body("recurrence.nextDate")
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage("A próxima data de recorrência precisa ser válida."),
  ];
};

module.exports = {
  financialCreateValidation,
  financialUpdateValidation,
};