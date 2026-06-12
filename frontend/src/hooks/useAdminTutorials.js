import { useState } from "react";
import { tutorials } from "../data/helpData";

export const useAdminTutorials = (
  selectedTutorial,
  selectedDeleteTutorial,
  openTutorialModal,
  closeTutorialModal,
  closeDeleteTutorialModal,
) => {
  const [adminTutorials, setAdminTutorials] = useState(tutorials || []);

  const [tutorialForm, setTutorialForm] = useState({
    question: "",
    category: "",
    answer: "",
  });

  const handleTutorialChange = (field, value) => {
    setTutorialForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const resetTutorialForm = () => {
    setTutorialForm({
      question: "",
      category: "",
      answer: "",
    });
  };

  const fillTutorialForm = (tutorial) => {
    setTutorialForm({
      question: tutorial.question || "",
      category: tutorial.category || "",
      answer: tutorial.answer || "",
    });
  };

  const handleOpenCreateTutorialModal = () => {
    resetTutorialForm();
    openTutorialModal(null);
  };

  const handleOpenEditTutorialModal = (tutorial) => {
    fillTutorialForm(tutorial);
    openTutorialModal(tutorial);
  };

  const handleCloseTutorialModal = () => {
    closeTutorialModal();
    resetTutorialForm();
  };

  const handleSubmitTutorial = (e) => {
    e.preventDefault();

    const tutorialData = {
      id: selectedTutorial?.id || selectedTutorial?._id || crypto.randomUUID(),
      question: tutorialForm.question.trim(),
      category: tutorialForm.category,
      answer: tutorialForm.answer.trim(),
    };

    if (
      !tutorialData.question ||
      !tutorialData.category ||
      !tutorialData.answer
    ) {
      return;
    }

    if (selectedTutorial?.id) {
      setAdminTutorials((prevState) =>
        prevState.map((tutorial) =>
          tutorial.id === selectedTutorial.id ? tutorialData : tutorial,
        ),
      );
    } else {
      setAdminTutorials((prevState) => [tutorialData, ...prevState]);
    }

    handleCloseTutorialModal();
  };

  const handleConfirmDeleteTutorial = () => {
    if (!selectedDeleteTutorial?.id) return;

    setAdminTutorials((prevState) =>
      prevState.filter((tutorial) => tutorial.id !== selectedDeleteTutorial.id),
    );

    closeDeleteTutorialModal();
  };

  return {
    adminTutorials,
    tutorialForm,
    handleTutorialChange,
    handleOpenCreateTutorialModal,
    handleOpenEditTutorialModal,
    handleCloseTutorialModal,
    handleSubmitTutorial,
    handleConfirmDeleteTutorial,
  };
};