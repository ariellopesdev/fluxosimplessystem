const { body } = require("express-validator");

const productCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome do produto é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),

    body("stock")
      .notEmpty()
      .withMessage("O estoque é obrigatório.")
      .isInt({ min: 0 })
      .withMessage("O estoque precisa ser um número válido."),

    body("unityPrice")
      .notEmpty()
      .withMessage("O preço unitário é obrigatório.")
      .isFloat({ gt: 0 })
      .withMessage("O preço unitário precisa ser maior que zero."),
  ];
};

const productUpdateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome do produto é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),

    body("stock")
      .notEmpty()
      .withMessage("O estoque é obrigatório.")
      .isInt({ min: 0 })
      .withMessage("O estoque precisa ser um número válido."),

    body("unityPrice")
      .notEmpty()
      .withMessage("O preço unitário é obrigatório.")
      .isFloat({ gt: 0 })
      .withMessage("O preço unitário precisa ser maior que zero."),
  ];
};

module.exports = {
  productCreateValidation,
  productUpdateValidation,
};