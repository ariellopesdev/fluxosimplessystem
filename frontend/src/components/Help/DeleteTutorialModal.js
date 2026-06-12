// React
import { createPortal } from "react-dom";

// Icons
import { IoClose } from "react-icons/io5";

const DeleteTutorialModal = ({
  selectedDeleteTutorial,
  closeDeleteTutorialModal,
  handleConfirmDeleteTutorial,
}) => {
  return createPortal(
    <div className="helpAccess__modalOverlay">
      <div className="helpAccess__deleteModal">
        <div className="helpAccess__modalHeader">
          <h3>Excluir Tutorial</h3>

          <button
            type="button"
            className="helpAccess__closeBtn"
            onClick={closeDeleteTutorialModal}
          >
            <IoClose />
          </button>
        </div>

        <div className="helpAccess__deleteContent">
          <p>Deseja realmente excluir o tutorial:</p>
          <strong>{selectedDeleteTutorial.question}</strong>
          <span>Esta ação não poderá ser desfeita.</span>
        </div>

        <div className="helpAccess__deleteActions">
          <button
            type="button"
            className="helpAccess__btn helpAccess__btnSecondary"
            onClick={closeDeleteTutorialModal}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="helpAccess__btn helpAccess__btnDanger"
            onClick={handleConfirmDeleteTutorial}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DeleteTutorialModal;