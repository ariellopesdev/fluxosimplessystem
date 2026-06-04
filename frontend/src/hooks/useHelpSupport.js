import { useState } from "react";

import {
  addSupportMessage,
  createSupportTicket,
  getMySupportTickets,
} from "../slices/supportSlice";

export const useHelpSupport = (dispatch, selectedTicket) => {
  // Support modal state
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Support ticket form state
  const [supportData, setSupportData] = useState({
    subject: "",
    category: "OTHER",
    priority: "MEDIUM",
    message: "",
  });

  // Support ticket form errors
  const [supportErrors, setSupportErrors] = useState({});

  // Chat message state
  const [chatMessage, setChatMessage] = useState("");

  // Chat message error
  const [chatError, setChatError] = useState("");

  // Open support modal
  const openSupportModal = () => {
    setShowSupportModal(true);
  };

  // Close support modal
  const closeSupportModal = () => {
    setShowSupportModal(false);
  };

  // Get validation message for support form fields
  const getSupportFieldError = (fieldName, value) => {
    const trimmedValue = String(value || "").trim();

    switch (fieldName) {
      case "subject":
        if (!trimmedValue) return "O assunto é obrigatório.";
        if (trimmedValue.length < 3)
          return "O assunto precisa ter no mínimo 3 caracteres.";
        if (trimmedValue.length > 120)
          return "O assunto pode ter no máximo 120 caracteres.";
        return "";

      case "message":
        if (!trimmedValue) return "A mensagem é obrigatória.";
        if (trimmedValue.length < 5)
          return "A mensagem precisa ter no mínimo 5 caracteres.";
        if (trimmedValue.length > 2000)
          return "A mensagem pode ter no máximo 2000 caracteres.";
        return "";

      default:
        return "";
    }
  };

  // Validate a single support form field
  const validateSupportField = (fieldName, value) => {
    const fieldError = getSupportFieldError(fieldName, value);

    setSupportErrors((prev) => ({
      ...prev,
      [fieldName]: fieldError,
    }));

    return fieldError;
  };

  // Validate support form before submit
  const validateSupportForm = () => {
    const validationErrors = {
      subject: getSupportFieldError("subject", supportData.subject),
      message: getSupportFieldError("message", supportData.message),
    };

    setSupportErrors(validationErrors);

    return !Object.values(validationErrors).some((item) => item);
  };

  // Validate chat message before submit
  const validateChatMessage = () => {
    const trimmedMessage = chatMessage.trim();

    if (!trimmedMessage) {
      setChatError("A mensagem é obrigatória.");
      return false;
    }

    if (trimmedMessage.length < 2) {
      setChatError("A mensagem precisa ter no mínimo 2 caracteres.");
      return false;
    }

    if (trimmedMessage.length > 2000) {
      setChatError("A mensagem pode ter no máximo 2000 caracteres.");
      return false;
    }

    setChatError("");
    return true;
  };

  // Update support form field
  const handleSupportChange = (fieldName, value) => {
    setSupportData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (fieldName === "subject" || fieldName === "message") {
      validateSupportField(fieldName, value);
    }
  };

  // Reset support form
  const resetSupportForm = () => {
    setSupportData({
      subject: "",
      category: "OTHER",
      priority: "MEDIUM",
      message: "",
    });

    setSupportErrors({});
  };

  // Create support ticket
  const handleCreateSupport = async (e) => {
    e.preventDefault();

    const isValid = validateSupportForm();

    if (!isValid) {
      return;
    }

    try {
      await dispatch(createSupportTicket(supportData)).unwrap();

      resetSupportForm();
      closeSupportModal();

      dispatch(getMySupportTickets());
    } catch (error) {
      console.error(error);
    }
  };

  // Send support chat message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const isValid = validateChatMessage();

    if (!isValid || !selectedTicket?._id) {
      return;
    }

    try {
      await dispatch(
        addSupportMessage({
          id: selectedTicket._id,
          messageData: {
            message: chatMessage.trim(),
          },
        }),
      ).unwrap();

      setChatMessage("");
      setChatError("");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    showSupportModal,
    supportData,
    supportErrors,
    chatMessage,
    chatError,
    setChatMessage,
    openSupportModal,
    closeSupportModal,
    handleSupportChange,
    handleCreateSupport,
    handleSendMessage,
  };
};
