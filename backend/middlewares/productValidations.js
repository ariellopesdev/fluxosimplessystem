const { body } = require("express-validator");

const productCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome do produto é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome do produto precisa ter no mínimo 3 caracteres."),

    body("description")
      .optional()
      .isString()
      .withMessage("A descrição precisa ser um texto."),

    body("price")
      .notEmpty()
      .withMessage("O preço do produto é obrigatório.")
      .isFloat({ gt: 0 })
      .withMessage("O preço precisa ser maior que zero."),
  ];
};

const productUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome do produto precisa ter no mínimo 3 caracteres."),

    body("description")
      .optional()
      .isString()
      .withMessage("A descrição precisa ser um texto."),

    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("O preço precisa ser maior que zero."),
  ];
};

module.exports = {
  productCreateValidation,
  productUpdateValidation,
};