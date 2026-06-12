//React
import { createPortal } from "react-dom";

// Components
import Message from "../Message/Message";

// Utils
import {
  isAdminMessage,
  translatePriority,
  translateStatus,
} from "../../utils/supportUtils";

//Icons
import { IoClose } from "react-icons/io5";
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
    <div className="help__modalOverlay" onClick={closeChatModal}>
      <div
        className="help__modal help__chatModal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="help__modalHeader">
          <div>
            <h3>{selectedTicket.subject}</h3>
            <small>
              {translateStatus(selectedTicket.status)} • Prioridade{" "}
              {translatePriority(selectedTicket.priority)}
            </small>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            className="help__closeBtn"
            onClick={closeChatModal}
          >
            <IoClose />
          </button>
        </div>

        {/* CHAT MESSAGES */}
        <div className="help__chat">
          {selectedTicket.messages?.map((msg) => (
            <div
              key={msg._id}
              className={`help__chatMessage ${
                msg.sender?._id === selectedTicket.openedBy?._id ||
                msg.sender === selectedTicket.openedBy?._id
                  ? "me"
                  : "other"
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

        {/* CHAT FORM */}
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
