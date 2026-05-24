const { body } = require("express-validator");

const validPaymentMethods = [
  "CASH",
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_SLIP",
  "TRANSFER",
];

const validPaymentStatus = ["PENDING", "PAID", "CANCELLED", "REFUNDED"];

const validSaleStatus = ["OPEN", "FINISHED", "CANCELLED"];

const salesCreateValidation = () => {
  return [
    body("client")
      .trim()
      .notEmpty()
      .withMessage("O cliente é obrigatório.")
      .isMongoId()
      .withMessage("Cliente inválido."),

    body("products")
      .isArray({ min: 1 })
      .withMessage("A venda precisa ter pelo menos um produto."),

    body("products.*.product")
      .trim()
      .notEmpty()
      .withMessage("O produto é obrigatório.")
      .isMongoId()
      .withMessage("Produto inválido."),

    body("products.*.quantity")
      .notEmpty()
      .withMessage("A quantidade é obrigatória.")
      .isInt({ min: 1 })
      .withMessage("A quantidade precisa ser maior que zero."),

    body("discount")
      .optional({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage("O desconto não pode ser negativo."),

    body("shipping")
      .optional({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage("O frete não pode ser negativo."),

    body("payment.method")
      .optional({ checkFalsy: true })
      .isIn(validPaymentMethods)
      .withMessage("Método de pagamento inválido."),

    body("payment.status")
      .optional({ checkFalsy: true })
      .isIn(validPaymentStatus)
      .withMessage("Status do pagamento inválido."),

    body("payment.installments")
      .optional({ checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("A quantidade de parcelas precisa ser maior que zero."),

    body("notes")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 500 })
      .withMessage("As observações devem ter no máximo 500 caracteres."),
  ];
};

const salesUpdateValidation = () => {
  return [
    body("payment.method")
      .optional({ checkFalsy: true })
      .isIn(validPaymentMethods)
      .withMessage("Método de pagamento inválido."),

    body("payment.status")
      .optional({ checkFalsy: true })
      .isIn(validPaymentStatus)
      .withMessage("Status do pagamento inválido."),

    body("payment.installments")
      .optional({ checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage("A quantidade de parcelas precisa ser maior que zero."),

    body("status")
      .optional({ checkFalsy: true })
      .isIn(validSaleStatus)
      .withMessage("Status da venda inválido."),

    body("notes")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 500 })
      .withMessage("As observações devem ter no máximo 500 caracteres."),
  ];
};

module.exports = {
  salesCreateValidation,
  salesUpdateValidation,
};
