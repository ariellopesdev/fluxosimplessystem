import { useCallback, useState } from "react";

export const useForgotPasswordForm = () => {
  // Forgot password form state
  const [formData, setFormData] = useState({
    email: "",
    captchaToken: "",
  });

  // Field validation errors
  const [errors, setErrors] = useState({});

  // Get validation message for a specific field
  const getFieldError = (fieldName, value) => {
    const trimmedValue = String(value || "").trim();

    switch (fieldName) {
      case "email": {
        if (!trimmedValue) return "O e-mail é obrigatório.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedValue)) {
          return "Insira um e-mail válido.";
        }

        return "";
      }

      case "captcha":
        if (!value) return "Confirme que você não é um robô.";
        return "";

      default:
        return "";
    }
  };

  // Validate a single field
  const validateField = (fieldName, value) => {
    const fieldError = getFieldError(fieldName, value);

    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));

    return fieldError;
  };

  // Validate form before submit
  const validateForm = () => {
    const validationErrors = {
      email: getFieldError("email", formData.email),
      captcha: getFieldError("captcha", formData.captchaToken),
    };

    setErrors(validationErrors);

    return !Object.values(validationErrors).some((item) => item);
  };

  // Handle email changes
  const handleChange = (fieldName, value) => {
    const updatedFormData = {
      ...formData,
      [fieldName]: value,
    };

    setFormData(updatedFormData);
    validateField(fieldName, value);
  };

  // Handle captcha changes
  const handleCaptchaChange = (token) => {
    const captchaToken = token || "";

    setFormData((prev) => ({
      ...prev,
      captchaToken,
    }));

    validateField("captcha", captchaToken);
  };

  // Reset form state
  const resetForm = useCallback(() => {
    setFormData({
      email: "",
      captchaToken: "",
    });

    setErrors({});
  }, []);

  // Check if form contains errors
  const hasErrors = Object.values(errors).some((item) => item);

  // Expose forgot password form state and actions
  return {
    formData,
    errors,
    hasErrors,
    handleChange,
    handleCaptchaChange,
    validateForm,
    resetForm,
  };
};