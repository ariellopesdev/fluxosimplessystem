//React Hooks
import { useCallback, useState } from "react";

export const useRegisterForm = () => {
  //Register form date
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    cnpj: "",
    role: "USER",
  });

  //Field validation errors
  const [errors, setErrors] = useState({});

  //Remove non-numeric characters
  const onlyNumbers = (value) => value.replace(/\D/g, "");

  //Format CNPJ mask while typing
  const formatCNPJ = (value) => {
    value = onlyNumbers(value).slice(0, 14);

    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");

    return value;
  };

  //Validate CNPJ verification digits
  const isValidCNPJ = (value) => {
    const cnpj = onlyNumbers(value);

    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

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

  //Get validation message for a specific field
  const getFieldError = (
    fieldName,
    value,
    currentPassword = formData.password,
  ) => {
    const trimmedValue = String(value || "").trim();

    switch (fieldName) {
      case "name":
        if (!trimmedValue) return "O nome é obrigatório.";
        if (trimmedValue.length < 3)
          return "O nome deve ter no mínimo 3 caracteres.";
        return "";

      case "email": {
        if (!trimmedValue) return "O e-mail é obrigatório.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedValue)) return "Insira um e-mail válido.";
        return "";
      }

      case "password":
        if (!value) return "A senha é obrigatória.";
        if (value.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
        if (!/[A-Z]/.test(value))
          return "A senha deve conter ao menos uma letra maiúscula.";
        if (!/[a-z]/.test(value))
          return "A senha deve conter ao menos uma letra minúscula.";
        if (!/[0-9]/.test(value))
          return "A senha deve conter ao menos um número.";
        return "";

      case "confirmPassword":
        if (!value) return "Confirme a senha.";
        if (value !== currentPassword) return "As senhas não coincidem.";
        return "";

      case "companyName":
        if (!trimmedValue) return "O nome da empresa é obrigatório.";
        if (trimmedValue.length < 2)
          return "O nome da empresa deve ter no mínimo 2 caracteres.";
        return "";

      case "cnpj": {
        const cleanedCnpj = onlyNumbers(value);

        if (!cleanedCnpj) return "O CNPJ é obrigatório.";
        if (cleanedCnpj.length < 14) return "CNPJ incompleto.";
        if (!isValidCNPJ(value)) return "CNPJ inválido.";

        return "";
      }

      default:
        return "";
    }
  };

  //Validate a single form field
  const validateField = (fieldName, value, updatedFormData = formData) => {
    const fieldError = getFieldError(
      fieldName,
      value,
      updatedFormData.password,
    );

    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));

    return fieldError;
  };

  //Validate all form fields before submit
  const validateForm = (isEditing = false) => {
    const validationErrors = {
      name: getFieldError("name", formData.name),
      email: getFieldError("email", formData.email),

      password:
        isEditing && !formData.password
          ? ""
          : getFieldError("password", formData.password),

      confirmPassword:
        isEditing && !formData.password && !formData.confirmPassword
          ? ""
          : getFieldError(
              "confirmPassword",
              formData.confirmPassword,
              formData.password,
            ),

      companyName: getFieldError("companyName", formData.companyName),
      cnpj: getFieldError("cnpj", formData.cnpj),
    };

    setErrors(validationErrors);

    return !Object.values(validationErrors).some((item) => item);
  };

  //Handle field changes and live validation
  const handleChange = (fieldName, value) => {
    let formattedValue = value;

    if (fieldName === "cnpj") {
      formattedValue = formatCNPJ(value);
    }

    const updatedFormData = {
      ...formData,
      [fieldName]: formattedValue,
    };

    setFormData(updatedFormData);
    validateField(fieldName, formattedValue, updatedFormData);

    if (fieldName === "password" && formData.confirmPassword) {
      validateField(
        "confirmPassword",
        formData.confirmPassword,
        updatedFormData,
      );
    }
  };

  //Reset form data and validation states
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      cnpj: "",
      role: "USER",
    });

    setErrors({});
  }, []);

  //Check if form contains validation errors
  const hasErrors = Object.values(errors).some((item) => item);

  //Expose register form state and actions
  return {
    formData,
    errors,
    hasErrors,
    setFormData,
    handleChange,
    validateForm,
    resetForm,
  };
};
