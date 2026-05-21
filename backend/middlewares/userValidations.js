const { body } = require("express-validator");

const isValidCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);

  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;

    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result != digits.charAt(0)) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);

  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;

    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result != digits.charAt(1)) return false;

  return true;
};

const userCreateValidation = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("Nome deve ter pelo menos 3 caracteres."),
    body("email")
      .trim()
      .normalizeEmail()
      .notEmpty()
      .isString()
      .withMessage("E-mail é obrigatório.")
      .isEmail()
      .withMessage("E-mail inválido."),
    body("password")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Senha é obrigatória.")
      .isLength({ min: 6 })
      .withMessage("Senha precisa ter no mínimo 6 caracteres."),
    body("confirmPassword")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Confirmação de senha é obrigatório.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas não coincidem.");
        }
        return true;
      }),
    body("companyName")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("Nome da empresa é obrigatório.")
      .isLength({ min: 2 })
      .withMessage("Nome da empresa muito curto."),
    body("cnpj")
      .notEmpty()
      .withMessage("O CNPJ da empresa é obrigatório.")
      .custom((value) => {
        if (!isValidCNPJ(value)) {
          throw new Error("CNPJ inválido.");
        }
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .trim()
      .normalizeEmail()
      .notEmpty()
      .isString()
      .withMessage("E-mail é obrigatório.")
      .isEmail()
      .withMessage("E-mail inválido."),
    body("password")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("A senha é obrigatória."),
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Nome precisa de pelo menos 3 caracteres."),
    body("password")
      .optional()
      .trim()
      .isLength({ min: 6 })
      .withMessage("Senha precisa ter no mínimo 6 caracteres."),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
