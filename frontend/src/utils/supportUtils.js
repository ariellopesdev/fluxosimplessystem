export const translateStatus = (status) => {
  const statuses = {
    OPEN: "Aberto",
    IN_PROGRESS: "Em atendimento",
    ANSWERED: "Respondido",
    CLOSED: "Fechado",
    CANCELED: "Cancelado",
  };

  return statuses[status] || "-";
};

export const translatePriority = (priority) => {
  const priorities = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
  };

  return priorities[priority] || "-";
};

export const translateCategory = (category) => {
  const categories = {
    ACCOUNT: "Conta",
    PRODUCTS: "Produtos",
    CLIENTS: "Clientes",
    SERVICES: "Serviços",
    APPOINTMENTS: "Agendamentos",
    FINANCIAL: "Financeiro",
    REPORTS: "Relatórios",
    DASHBOARD: "Dashboard",
    SETTINGS: "Configurações",
    BUG: "Bug",
    OTHER: "Outro",
  };

  return categories[category] || "-";
};

export const isAdminMessage = (senderRole) => {
  return senderRole === "SUPER_ADMIN" || senderRole === "ADMIN";
};

export const formatTicketNumber = (ticket) => {
  const number = ticket.ticketNumber || ticket._id?.slice(-4) || "0000";

  return `#${String(number).padStart(4, "0")}`;
};

export const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("pt-BR");
};

export const isTicketFinished = (ticket) => {
  return ticket?.status === "CLOSED" || ticket?.status === "CANCELED";
};

export const getTicketStatusTitle = (status) => {
  const titles = {
    OPEN: "Chamados aguardando atendimento",
    IN_PROGRESS: "Chamados em andamento",
    CLOSED: "Chamados concluídos",
    CANCELED: "Chamados cancelados",
  };

  return titles[status] || "Chamados";
};
