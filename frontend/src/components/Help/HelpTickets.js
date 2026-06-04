const HelpTickets = ({
  myTickets,
  translateStatus,
  translatePriority,
  handleOpenTicket,
}) => {
  return (
    <div className="help__tickets">
      <div className="help__sectionHeader">
        <div>
          <h3>Meus chamados</h3>
          <p>Acompanhe suas solicitações e converse com o suporte.</p>
        </div>
        <span>{myTickets?.length || 0} chamado(s)</span>
      </div>

      {myTickets?.length > 0 ? (
        myTickets.map((ticket) => (
          <button
            type="button"
            key={ticket._id}
            className="help__ticketItem"
            onClick={() => handleOpenTicket(ticket._id)}
          >
            <div>
              <strong>{ticket.subject}</strong>

              <small>
                {translateStatus(ticket.status)} • Prioridade{" "}
                {translatePriority(ticket.priority)}
              </small>
            </div>

            <span>
              {ticket.lastMessageAt
                ? new Date(ticket.lastMessageAt).toLocaleDateString("pt-BR")
                : "-"}
            </span>
          </button>
        ))
      ) : (
        <div className="help__empty">Nenhum chamado aberto.</div>
      )}
    </div>
  );
};

export default HelpTickets;