const { body } = require("express-validator");

const onlyNumbers = (value = "") => String(value).replace(/\D/g, "");

const isValidCPF = (cpf) => {
  cpf = onlyNumbers(cpf);

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  let rest;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;

  return rest === parseInt(cpf.substring(10, 11));
};

const isValidCNPJ = (cnpj) => {
  cnpj = onlyNumbers(cnpj);

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(0))) return false;

  size += 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return result === Number(digits.charAt(1));
};

const isValidCpfCnpj = (value) => {
  const numbers = onlyNumbers(value);

  if (!numbers) return true;

  if (numbers.length === 11) return isValidCPF(numbers);
  if (numbers.length === 14) return isValidCNPJ(numbers);

  return false;
};

const isValidPhone = (value) => {
  const numbers = onlyNumbers(value);

  if (!numbers) return true;

  return numbers.length === 10 || numbers.length === 11;
};

const isValidCEP = (value) => {
  const numbers = onlyNumbers(value);

  if (!numbers) return true;

  return numbers.length === 8;
};

const clientCreateValidation = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("O nome do cliente é obrigatório.")
      .isLength({ min: 3, max: 100 })
      .withMessage("O nome precisa ter entre 3 e 100 caracteres."),

    body("email")
      .optional({ checkFalsy: true })
      .trim()
      .isEmail()
      .withMessage("E-mail inválido.")
      .normalizeEmail(),

    body("primaryPhone")
      .trim()
      .notEmpty()
      .withMessage("O telefone principal é obrigatório.")
      .custom(isValidPhone)
      .withMessage("Telefone principal inválido."),

    body("secondaryPhone")
      .optional({ checkFalsy: true })
      .trim()
      .custom(isValidPhone)
      .withMessage("Telefone secundário inválido."),

    body("emergencyPhone")
      .optional({ checkFalsy: true })
      .trim()
      .custom(isValidPhone)
      .withMessage("Telefone de emergência inválido."),

    body("cpfCnpj")
      .optional({ checkFalsy: true })
      .trim()
      .custom(isValidCpfCnpj)
      .withMessage("CPF ou CNPJ inválido."),

    body("street")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 120 })
      .withMessage("A rua deve ter no máximo 120 caracteres."),

    body("number")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 20 })
      .withMessage("O número deve ter no máximo 20 caracteres."),

    body("complement")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 80 })
      .withMessage("O complemento deve ter no máximo 80 caracteres."),

    body("neighborhood")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 80 })
      .withMessage("O bairro deve ter no máximo 80 caracteres."),

    body("city")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 80 })
      .withMessage("A cidade deve ter no máximo 80 caracteres."),

    body("state")
      .optional({ checkFalsy: true })
      .trim()
      .isIn([
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
      ])
      .withMessage("Estado inválido."),

    body("zipCode")
      .optional({ checkFalsy: true })
      .trim()
      .custom(isValidCEP)
      .withMessage("CEP inválido."),

    body("type")
      .optional()
      .isIn(["PERSON", "COMPANY"])
      .withMessage("Tipo de cliente inválido."),

    body("financial")
      .optional()
      .isIn(["ACTIVE", "CANCELLED"])
      .withMessage("Status financeiro inválido."),

    body("notes")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 500 })
      .withMessage("As observações devem ter no máximo 500 caracteres."),
  ];
};

const clientUpdateValidation = () => {
  return [
    body("name")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("O nome precisa ter entre 3 e 100 caracteres."),

    body("email")
      .optional({ checkFalsy: true })
      .trim()
      .isEmail()
      .withMessage("E-mail inválido.")
      .normalizeEmail(),

    body("primaryPhone")
      .optional({ checkFalsy: true })
      .trim()
      .custom(isValidPhone)
      .withMessage("Telefone principal inválido."),

    body("secondaryPhone")
      .optional({ checkFalsy: true })
      .trim()
      .custom(isValidPhone)
      .withMessage("Telefone secundário inválido."),

    body("emergencyPhone")
      .optional({ checkFalsy: true })
      .trim()
      .custom(isValidPhone)
      .withMessage("Telefone de emergência inválido."),

    body("cpfCnpj")
      .optional({ checkFalsy: true })
      .trim()
      .custom(isValidCpfCnpj)
      .withMessage("CPF ou CNPJ inválido."),

    body("street")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 120 })
      .withMessage("A rua deve ter no máximo 120 caracteres."),

    body("number")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 20 })
      .withMessage("O número deve ter no máximo 20 caracteres."),

    body("complement")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 80 })
      .withMessage("O complemento deve ter no máximo 80 caracteres."),

    body("neighborhood")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 80 })
      .withMessage("O bairro deve ter no máximo 80 caracteres."),

    body("city")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 80 })
      .withMessage("A cidade deve ter no máximo 80 caracteres."),

    body("state")
      .optional({ checkFalsy: true })
      .trim()
      .isIn([
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
      ])
      .withMessage("Estado inválido."),

    body("zipCode")
      .optional({ checkFalsy: true })
      .trim()
      .custom(isValidCEP)
      .withMessage("CEP inválido."),

    body("type")
      .optional()
      .isIn(["PERSON", "COMPANY"])
      .withMessage("Tipo de cliente inválido."),

    body("financial")
      .optional()
      .isIn(["ACTIVE", "CANCELLED"])
      .withMessage("Status financeiro inválido."),

    body("notes")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 500 })
      .withMessage("As observações devem ter no máximo 500 caracteres."),
  ];
};

module.exports = {
  clientCreateValidation,
  clientUpdateValidation,
};