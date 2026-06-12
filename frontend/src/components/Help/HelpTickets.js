import { useMemo, useState } from "react";

const HelpTickets = ({
  myTickets,
  translateStatus,
  translatePriority,
  handleOpenTicket,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const tickets = Array.isArray(myTickets) ? myTickets : [];

  const totals = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "OPEN").length,
      inProgress: tickets.filter(
        (ticket) =>
          ticket.status === "IN_PROGRESS" || ticket.status === "ANSWERED",
      ).length,
      closed: tickets.filter((ticket) => ticket.status === "CLOSED").length,
      canceled: tickets.filter((ticket) => ticket.status === "CANCELED").length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (selectedStatus === "ALL") return tickets;

    if (selectedStatus === "IN_PROGRESS") {
      return tickets.filter(
        (ticket) =>
          ticket.status === "IN_PROGRESS" || ticket.status === "ANSWERED",
      );
    }

    return tickets.filter((ticket) => ticket.status === selectedStatus);
  }, [tickets, selectedStatus]);

  const formatTicketNumber = (ticket) => {
    const number = ticket.ticketNumber || ticket._id?.slice(-4) || "0000";

    return `#${String(number).padStart(4, "0")}`;
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("pt-BR");
  };

  const getTicketWaitingText = (ticket) => {
    const lastMessage = ticket.messages?.[ticket.messages.length - 1];

    if (ticket.status === "OPEN") {
      return "Aguardando atendimento do suporte";
    }

    if (ticket.status === "CLOSED") {
      return "Chamado concluído";
    }

    if (ticket.status === "CANCELED") {
      return "Chamado cancelado";
    }

    if (lastMessage?.senderRole === "SUPER_ADMIN") {
      return "Aguardando sua resposta";
    }

    return "Aguardando resposta do suporte";
  };

  const getFilterTitle = () => {
    const titles = {
      ALL: "Todos os chamados",
      OPEN: "Chamados abertos",
      IN_PROGRESS: "Chamados em atendimento",
      CLOSED: "Chamados concluídos",
      CANCELED: "Chamados cancelados",
    };

    return titles[selectedStatus] || "Meus chamados";
  };

  return (
    <div className="help__tickets">
      <div className="help__sectionHeader">
        <div>
          <h3>Meus chamados</h3>
          <p>Acompanhe suas solicitações e converse com o suporte.</p>
        </div>

        <span>{tickets.length} chamado(s)</span>
      </div>

      <div className="help__ticketFilters">
        <button
          type="button"
          className={`help__ticketFilter ${
            selectedStatus === "ALL" ? "active" : ""
          }`}
          onClick={() => setSelectedStatus("ALL")}
        >
          <strong>{totals.all}</strong>
          <span>Todos</span>
        </button>

        <button
          type="button"
          className={`help__ticketFilter open ${
            selectedStatus === "OPEN" ? "active" : ""
          }`}
          onClick={() => setSelectedStatus("OPEN")}
        >
          <strong>{totals.open}</strong>
          <span>Abertos</span>
        </button>

        <button
          type="button"
          className={`help__ticketFilter progress ${
            selectedStatus === "IN_PROGRESS" ? "active" : ""
          }`}
          onClick={() => setSelectedStatus("IN_PROGRESS")}
        >
          <strong>{totals.inProgress}</strong>
          <span>Em atendimento</span>
        </button>

        <button
          type="button"
          className={`help__ticketFilter closed ${
            selectedStatus === "CLOSED" ? "active" : ""
          }`}
          onClick={() => setSelectedStatus("CLOSED")}
        >
          <strong>{totals.closed}</strong>
          <span>Concluídos</span>
        </button>

        <button
          type="button"
          className={`help__ticketFilter canceled ${
            selectedStatus === "CANCELED" ? "active" : ""
          }`}
          onClick={() => setSelectedStatus("CANCELED")}
        >
          <strong>{totals.canceled}</strong>
          <span>Cancelados</span>
        </button>
      </div>

      <div className="help__ticketListHeader">
        <h4>{getFilterTitle()}</h4>
        <small>{filteredTickets.length} resultado(s)</small>
      </div>

      {filteredTickets.length > 0 ? (
        <div className="help__ticketList">
          {filteredTickets.map((ticket) => (
            <button
              type="button"
              key={ticket._id}
              className={`help__ticketItem ${ticket.status}`}
              onClick={() => handleOpenTicket(ticket._id)}
            >
              <div className="help__ticketInfo">
                <div className="help__ticketTitle">
                  <strong>{ticket.subject}</strong>
                  <span>{formatTicketNumber(ticket)}</span>
                </div>

                <div className="help__ticketBadges">
                  <small className={`help__ticketStatus ${ticket.status}`}>
                    {translateStatus(ticket.status)}
                  </small>

                  <small className="help__ticketPriority">
                    Prioridade {translatePriority(ticket.priority)}
                  </small>
                </div>

                <p>{getTicketWaitingText(ticket)}</p>
              </div>

              <div className="help__ticketDate">
                <span>Última atualização</span>
                <strong>{formatDateTime(ticket.lastMessageAt)}</strong>
                <small>Clique para abrir conversa</small>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="help__empty">Nenhum chamado encontrado.</div>
      )}
    </div>
  );
};

export default HelpTickets;