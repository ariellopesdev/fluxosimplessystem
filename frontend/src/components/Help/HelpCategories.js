import { FaQuestionCircle } from "react-icons/fa";

const HelpCategories = ({
  helpCategories,
  selectedCategory,
  setSelectedCategory,
  setOpenTutorial,
}) => {
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setOpenTutorial(null);
  };

  return (
    <div className="help__cards">
      <button
        type="button"
        className={`help__card ${selectedCategory === "all" ? "active" : ""}`}
        onClick={() => handleSelectCategory("all")}
      >
        <span>
          <FaQuestionCircle />
        </span>
        <strong>Todos</strong>
        <small>Ver toda a ajuda</small>
      </button>

      {helpCategories.map((category) => (
        <button
          type="button"
          key={category.id}
          className={`help__card ${
            selectedCategory === category.id ? "active" : ""
          }`}
          onClick={() => handleSelectCategory(category.id)}
        >
          <span>{category.icon}</span>
          <strong>{category.title}</strong>
          <small>{category.description}</small>
        </button>
      ))}
    </div>
  );
};

export default HelpCategories;