// React
import { createPortal } from "react-dom";

// Icons
import { IoClose } from "react-icons/io5";

const AdminTutorialModal = ({
  selectedTutorial,
  tutorialForm,
  helpCategories,
  handleTutorialChange,
  handleSubmitTutorial,
  handleCloseTutorialModal,
}) => {
  return createPortal(
    <div className="helpAccess__modalOverlay">
      <div className="helpAccess__modal">
        <div className="helpAccess__modalHeader">
          <h3>{selectedTutorial ? "Editar Tutorial" : "Novo Tutorial"}</h3>

          <button
            type="button"
            className="helpAccess__closeBtn"
            onClick={handleCloseTutorialModal}
          >
            <IoClose />
          </button>
        </div>

        <form onSubmit={handleSubmitTutorial} className="helpAccess__form">
          <div className="helpAccess__section">
            <h4>Dados do tutorial</h4>

            <div className="helpAccess__grid">
              <div className="form__group--helpAccess">
                <label>Pergunta</label>
                <input
                  type="text"
                  placeholder="Digite a pergunta"
                  value={tutorialForm.question}
                  onChange={(e) =>
                    handleTutorialChange("question", e.target.value)
                  }
                />
              </div>

              <div className="form__group--helpAccess">
                <label>Categoria</label>
                <select
                  value={tutorialForm.category}
                  onChange={(e) =>
                    handleTutorialChange("category", e.target.value)
                  }
                >
                  <option value="">Selecione uma categoria</option>

                  {helpCategories
                    .filter((category) => category.id !== "all")
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form__group--helpAccess full">
                <label>Resposta</label>
                <textarea
                  placeholder="Digite a resposta do tutorial"
                  value={tutorialForm.answer}
                  onChange={(e) =>
                    handleTutorialChange("answer", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <button type="submit" className="helpAccess__btn">
            {selectedTutorial ? "Salvar alterações" : "Cadastrar Tutorial"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default AdminTutorialModal;