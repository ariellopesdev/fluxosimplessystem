import { createPortal } from "react-dom";

// Components
import Message from "../Message/Message";

// Utils
import {
  isAdminMessage,
  translatePriority,
  translateStatus,
} from "../../utils/supportUtils";

const SupportChatModal = ({
  loading,
  selectedTicket,
  chatMessage,
  chatError,
  setChatMessage,
  handleSendMessage,
  closeChatModal,
}) => {
  return createPortal(
    <div className="help__modalOverlay">
      <div className="help__modal help__chatModal">
        <div className="help__modalHeader">
          <div>
            <h3>{selectedTicket.subject}</h3>
            <small>
              {translateStatus(selectedTicket.status)} • Prioridade{" "}
              {translatePriority(selectedTicket.priority)}
            </small>
          </div>

          <button type="button" onClick={closeChatModal}>
            ×
          </button>
        </div>

        <div className="help__chat">
          {selectedTicket.messages?.map((msg) => (
            <div
              key={msg._id}
              className={`help__chatMessage ${
                isAdminMessage(msg.senderRole) ? "admin" : "user"
              }`}
            >
              <strong>{msg.senderName || "Usuário"}</strong>
              <p>{msg.message}</p>
              <small>
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleString("pt-BR")
                  : "-"}
              </small>
            </div>
          ))}
        </div>

        {selectedTicket.status !== "CLOSED" && (
          <form onSubmit={handleSendMessage} className="help__chatForm">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              minLength={2}
              maxLength={2000}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className={chatError ? "input__error" : ""}
            />

            {!loading && <button type="submit">Enviar</button>}
            {loading && <button disabled>...</button>}

            {chatError && <Message msg={chatError} type="error" />}
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default SupportChatModal;
