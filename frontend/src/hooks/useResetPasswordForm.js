import { useCallback, useState } from "react";

export const useResetPasswordForm = () => {
  // Reset password form state
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState({});

  // Get validation message for a specific field
  const getFieldError = (fieldName, value, currentFormData = formData) => {
    switch (fieldName) {
      case "password":
        if (!value) return "A senha é obrigatória.";
        if (value.length < 6)
          return "A senha precisa ter no mínimo 6 caracteres.";
        if (!/[A-Z]/.test(value))
          return "A senha deve conter ao menos uma letra maiúscula.";
        if (!/[a-z]/.test(value))
          return "A senha deve conter ao menos uma letra minúscula.";
        if (!/[0-9]/.test(value))
          return "A senha deve conter ao menos um número.";
        return "";

      case "confirmPassword":
        if (!value) return "Confirme sua senha.";
        if (value !== currentFormData.password)
          return "As senhas precisam ser iguais.";
        return "";

      default:
        return "";
    }
  };

  // Validate a single field
  const validateField = (fieldName, value, currentFormData = formData) => {
    const fieldError = getFieldError(fieldName, value, currentFormData);

    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));

    return fieldError;
  };

  // Validate all fields before submit
  const validateForm = () => {
    const validationErrors = {
      password: getFieldError("password", formData.password),
      confirmPassword: getFieldError(
        "confirmPassword",
        formData.confirmPassword,
      ),
    };

    setErrors(validationErrors);

    return !Object.values(validationErrors).some((item) => item);
  };

  // Handle field changes and live validation
  const handleChange = (fieldName, value) => {
    const updatedFormData = {
      ...formData,
      [fieldName]: value,
    };

    setFormData(updatedFormData);
    validateField(fieldName, value, updatedFormData);

    if (fieldName === "password" && updatedFormData.confirmPassword) {
      validateField(
        "confirmPassword",
        updatedFormData.confirmPassword,
        updatedFormData,
      );
    }
  };

  // Reset form state
  const resetForm = useCallback(() => {
    setFormData({
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setErrors({});
  }, []);

  // Check if form contains errors
  const hasErrors = Object.values(errors).some((item) => item);

  // Expose reset password form state and actions
  return {
    formData,
    errors,
    hasErrors,
    showPassword,
    setShowPassword,
    handleChange,
    validateForm,
    resetForm,
  };
};
