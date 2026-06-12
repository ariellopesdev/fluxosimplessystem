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

export const translateDashboardModule = (module) => {
  const modules = {
    FINANCIAL: "Financeiro",
    SALES: "Vendas",
    PRODUCTS: "Produtos",
    CLIENTS: "Clientes",
    APPOINTMENTS: "Agendamentos",
    SERVICES: "Serviços",
    REPORTS: "Relatórios",
    GENERAL: "Geral",
    SUPPORT: "Suporte",
  };

  return modules[module] || module || "-";
};

export const translateActivityAction = (action) => {
  const actions = {
    CREATED: "Criado",
    UPDATED: "Atualizado",
    DELETED: "Excluído",

    PRODUCT_CREATED: "Produto cadastrado",
    PRODUCT_UPDATED: "Produto atualizado",
    PRODUCT_DELETED: "Produto removido",

    CLIENT_CREATED: "Cliente cadastrado",
    CLIENT_UPDATED: "Cliente atualizado",
    CLIENT_DELETED: "Cliente removido",

    SERVICE_CREATED: "Serviço cadastrado",
    SERVICE_UPDATED: "Serviço atualizado",
    SERVICE_DELETED: "Serviço removido",

    APPOINTMENT_CREATED: "Agendamento criado",
    APPOINTMENT_UPDATED: "Agendamento atualizado",
    APPOINTMENT_CANCELED: "Agendamento cancelado",
    APPOINTMENT_COMPLETED: "Agendamento concluído",

    SALE_CREATED: "Venda registrada",
    SALE_UPDATED: "Venda atualizada",
    SALE_DELETED: "Venda removida",

    REPORT_GENERATED: "Relatório gerado",

    SUPPORT_CREATED: "Chamado aberto",
    SUPPORT_UPDATED: "Chamado atualizado",
    SUPPORT_ANSWERED: "Chamado respondido",
    SUPPORT_CLOSED: "Chamado concluído",
    SUPPORT_CANCELED: "Chamado cancelado",
  };

  return actions[action] || action || "-";
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
