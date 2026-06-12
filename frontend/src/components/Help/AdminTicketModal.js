// React
import { createPortal } from "react-dom";

// Icons
import { IoClose } from "react-icons/io5";

// Utils
import {
  formatDateTime,
  formatTicketNumber,
  isTicketFinished,
  translateCategory,
  translatePriority,
  translateStatus,
} from "../../utils/supportUtils";

const AdminTicketModal = ({
  loggedUser,
  selectedAdminTicket,
  chatMessage,
  setChatMessage,
  handleCloseAdminTicketModal,
  handleSendAdminResponse,
  handleUpdateTicketStatus,
}) => {
  return createPortal(
    <div className="helpAccess__modalOverlay">
      <div className="helpAccess__modal helpAccess__ticketModal">
        <div className="helpAccess__modalHeader">
          <div>
            <h3>{formatTicketNumber(selectedAdminTicket)}</h3>
            <small>{selectedAdminTicket.subject}</small>
          </div>

          <button
            type="button"
            className="helpAccess__closeBtn"
            onClick={handleCloseAdminTicketModal}
          >
            <IoClose />
          </button>
        </div>

        <div className="helpAccess__ticketSummary">
          <div className="helpAccess__ticketDetails">
            <div>
              <strong>Usuário</strong>
              <span>{selectedAdminTicket.openedBy?.name || "Usuário"}</span>
            </div>

            <div>
              <strong>Status</strong>
              <span>{translateStatus(selectedAdminTicket.status)}</span>
            </div>

            <div>
              <strong>Prioridade</strong>
              <span>{translatePriority(selectedAdminTicket.priority)}</span>
            </div>

            <div>
              <strong>Categoria</strong>
              <span>{translateCategory(selectedAdminTicket.category) || "-"}</span>
            </div>
          </div>

          <div className="helpAccess__ticketDescription">
            <strong>Mensagem de abertura</strong>
            <p>{selectedAdminTicket.messages?.[0]?.message || "-"}</p>
          </div>
        </div>

        <div className="helpAccess__chatBox">
          <div className="helpAccess__chatHeader">
            <div>
              <strong>Histórico da conversa</strong>
              <span>
                {selectedAdminTicket.messages?.length || 0} mensagem(ns)
                registradas
              </span>
            </div>
          </div>

          <div className="helpAccess__chat">
            {selectedAdminTicket.messages?.map((msg) => (
              <div
                key={msg._id}
                className={`helpAccess__chatMessage ${
                  msg.sender?._id === loggedUser?._id ||
                  msg.sender === loggedUser?._id
                    ? "me"
                    : "other"
                }`}
              >
                <strong>{msg.senderName || "Usuário"}</strong>
                <p>{msg.message}</p>
                <small>{formatDateTime(msg.createdAt)}</small>
              </div>
            ))}
          </div>
        </div>

        {isTicketFinished(selectedAdminTicket) && (
          <div className="helpAccess__closedInfo">
            <strong>
              Chamado{" "}
              {selectedAdminTicket.status === "CLOSED"
                ? "concluído"
                : "cancelado"}
            </strong>
            <span>
              Por {selectedAdminTicket.assignedTo?.name || "suporte"} em{" "}
              {formatDateTime(selectedAdminTicket.closedAt)}
            </span>
          </div>
        )}

        {!isTicketFinished(selectedAdminTicket) && (
          <form
            onSubmit={handleSendAdminResponse}
            className="helpAccess__form"
          >
            <div className="form__group--helpAccess full">
              <label>Resposta do suporte</label>
              <textarea
                placeholder="Digite sua resposta..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
            </div>

            <div className="helpAccess__deleteActions">
              <button type="submit" className="helpAccess__btn">
                Enviar resposta
              </button>

              <button
                type="button"
                className="helpAccess__btn"
                onClick={() =>
                  handleUpdateTicketStatus(selectedAdminTicket._id, "CLOSED")
                }
              >
                Concluir chamado
              </button>

              <button
                type="button"
                className="helpAccess__btn helpAccess__btnDanger"
                onClick={() =>
                  handleUpdateTicketStatus(selectedAdminTicket._id, "CANCELED")
                }
              >
                Cancelar chamado
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default AdminTicketModal;