const HelpFaq = ({
  selectedCategory,
  selectedCategoryData,
  filteredTutorials,
  openTutorial,
  setOpenTutorial,
}) => {
  return (
    <>
      <div className="help__sectionHeader">
        <div>
          <h3>
            {selectedCategory === "all"
              ? "Tutoriais rápidos"
              : selectedCategoryData?.title}
          </h3>

          <p>
            {selectedCategory === "all"
              ? "Veja respostas para as principais dúvidas do sistema."
              : selectedCategoryData?.description}
          </p>
        </div>

        <span>{filteredTutorials.length} item(ns)</span>
      </div>

      <div className="help__faq">
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map((item, index) => (
            <div
              key={`${item.category}-${index}`}
              className={`help__faqItem ${
                openTutorial === index ? "open" : ""
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenTutorial(openTutorial === index ? null : index)
                }
              >
                <span>{item.question}</span>
                <strong>{openTutorial === index ? "−" : "+"}</strong>
              </button>

              {openTutorial === index && <p>{item.answer}</p>}
            </div>
          ))
        ) : (
          <div className="help__empty">
            Nenhuma ajuda encontrada para essa busca.
          </div>
        )}
      </div>
    </>
  );
};

export default HelpFaq;