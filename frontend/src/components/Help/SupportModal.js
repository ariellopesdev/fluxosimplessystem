import { createPortal } from "react-dom";

// Components
import Message from "../Message/Message";

const SupportModal = ({
  loading,
  supportData,
  supportErrors,
  supportCategories,
  supportPriorities,
  handleSupportChange,
  handleCreateSupport,
  closeSupportModal,
}) => {
  return createPortal(
    <div className="help__modalOverlay">
      <div className="help__modal">
        <div className="help__modalHeader">
          <h3>Novo chamado de suporte</h3>

          <button type="button" onClick={closeSupportModal}>
            ×
          </button>
        </div>

        <form onSubmit={handleCreateSupport} className="help__supportForm">
          <label>Assunto</label>
          <input
            type="text"
            minLength={3}
            maxLength={120}
            value={supportData.subject}
            onChange={(e) => handleSupportChange("subject", e.target.value)}
            className={supportErrors.subject ? "input__error" : ""}
            required
          />
          {supportErrors.subject && (
            <Message msg={supportErrors.subject} type="error" />
          )}

          <label>Categoria</label>
          <select
            value={supportData.category}
            onChange={(e) => handleSupportChange("category", e.target.value)}
          >
            {supportCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <label>Prioridade</label>
          <select
            value={supportData.priority}
            onChange={(e) => handleSupportChange("priority", e.target.value)}
          >
            {supportPriorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>

          <label>Mensagem</label>
          <textarea
            minLength={5}
            maxLength={2000}
            value={supportData.message}
            onChange={(e) => handleSupportChange("message", e.target.value)}
            className={supportErrors.message ? "input__error" : ""}
            required
          />
          {supportErrors.message && (
            <Message msg={supportErrors.message} type="error" />
          )}

          {!loading && <button type="submit">Enviar chamado</button>}
          {loading && <button disabled>Aguarde...</button>}
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default SupportModal;
