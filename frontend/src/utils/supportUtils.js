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
