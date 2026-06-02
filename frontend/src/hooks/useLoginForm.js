//React Hooks
import { useCallback, useState } from "react";

export const useLoginForm = () => {
  //Login form date
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captchaToken: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errors, setErrors] = useState({});

  //Get validation message for a specific field
  const getFieldError = (fieldName, value) => {
    const trimmedValue = String(value || "").trim();

    switch (fieldName) {
      case "email": {
        if (!trimmedValue) return "O e-mail é obrigatório.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedValue)) return "Insira um e-mail válido.";

        return "";
      }

      case "password":
        if (!value) return "A senha é obrigatória.";
        return "";

      case "captcha":
        if (!value) return "Confirme que você não é um robô.";
        return "";

      default:
        return "";
    }
  };

  //Validate a single form field
  const validateField = (fieldName, value) => {
    const fieldError = getFieldError(fieldName, value);

    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));

    return fieldError;
  };

  //Validate all form fields before submit
  const validateForm = (shouldValidateCaptcha = false) => {
    const validationErrors = {
      email: getFieldError("email", formData.email),
      password: getFieldError("password", formData.password),
      captcha: shouldValidateCaptcha
        ? getFieldError("captcha", formData.captchaToken)
        : "",
    };

    setErrors(validationErrors);

    return !Object.values(validationErrors).some((item) => item);
  };

  //Handle field changes and live validation
  const handleChange = (fieldName, value) => {
    const updatedFormData = {
      ...formData,
      [fieldName]: value,
    };

    setFormData(updatedFormData);

    if (fieldName !== "captchaToken") {
      validateField(fieldName, value);
    }
  };

  //Handle captcha validation
  const handleCaptchaChange = (token) => {
    const captchaToken = token || "";

    setFormData((prev) => ({
      ...prev,
      captchaToken,
    }));

    validateField("captcha", captchaToken);
  };

  //Register failed login attempt
  const increaseFailedAttempts = useCallback(() => {
    setFailedAttempts((prev) => prev + 1);

    setFormData((prev) => ({
      ...prev,
      captchaToken: "",
    }));
  }, []);

  //Reset login form and validation states
  const resetForm = useCallback(() => {
    setFormData({
      email: "",
      password: "",
      captchaToken: "",
    });

    setShowPassword(false);
    setFailedAttempts(0);
    setErrors({});
  }, []);

  //Check if form contains validation errors
  const hasErrors = Object.values(errors).some((item) => item);
  //Check if captcha should be displayed
  const shouldShowCaptcha = failedAttempts >= 3;

  //Expose login from state and actions
  return {
    formData,
    errors,
    showPassword,
    failedAttempts,
    hasErrors,
    shouldShowCaptcha,
    setShowPassword,
    handleChange,
    handleCaptchaChange,
    increaseFailedAttempts,
    validateForm,
    resetForm,
  };
};
