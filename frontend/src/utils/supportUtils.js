export const translateStatus = (status) => {
  const statuses = {
    OPEN: "Aberto",
    IN_PROGRESS: "Em atendimento",
    ANSWERED: "Respondido",
    CLOSED: "Fechado",
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

export const isAdminMessage = (senderRole) => {
  return senderRole === "SUPER_ADMIN" || senderRole === "ADMIN";
};