const Support = require("../models/Support");
const sendEmail = require("../utils/sendEmail");
const Counter = require("../models/Counter");

const getCompanyId = (reqUser) => {
  return reqUser.company?._id || reqUser.company;
};

const isAdminUser = (user) => {
  return user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
};

const translateCategory = (category) => {
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

  return categories[category] || "Outro";
};

const notifySuperAdmin = async ({ support, reqUser, message }) => {
  try {
    const adminEmail = process.env.SUPPORT_ADMIN_EMAIL;

    if (!adminEmail) return;

    await sendEmail({
      email: adminEmail,
      subject: `Novo chamado de suporte - ${support.subject}`,
      message: `
Olá, Ariel.

Um novo chamado de suporte foi aberto no Fluxo Simples System.

Assunto: ${support.subject}
Categoria: ${translateCategory(support.category)}
Prioridade: ${support.priority}
Usuário: ${reqUser.name || "-"}
E-mail: ${reqUser.email || "-"}
Empresa: ${reqUser.company?.name || "-"}
CNPJ: ${reqUser.company?.cnpj || "-"}

Mensagem:
${message}

Acesse o sistema para responder o chamado.
      `.trim(),
    });
  } catch (error) {
    console.log("Erro ao enviar e-mail para super admin:", error);
  }
};

const createSupportTicket = async (req, res) => {
  const { subject, category, priority, message } = req.body;

  try {
    const reqUser = req.user;
    const companyId = getCompanyId(reqUser);
    const ticketNumber = await getNextTicketNumber();

    const support = await Support.create({
      subject,
      ticketNumber,
      category,
      priority,
      status: "OPEN",
      openedBy: reqUser._id,
      company: companyId,
      cnpj: reqUser.company?.cnpj,
      lastMessageAt: new Date(),
      messages: [
        {
          sender: reqUser._id,
          senderName: reqUser.name,
          senderEmail: reqUser.email,
          senderRole: reqUser.role || "USER",
          message,
          readByAdmin: false,
          readByUser: true,
        },
      ],
    });

    notifySuperAdmin({
      support,
      reqUser,
      message,
    });

    const populatedSupport = await Support.findById(support._id)
      .populate("openedBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(201).json({
      message: "Chamado enviado com sucesso.",
      support: populatedSupport,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao criar chamado de suporte."],
    });
  }
};

const getMySupportTickets = async (req, res) => {
  try {
    const supports = await Support.find({
      openedBy: req.user._id,
    })
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .populate("openedBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(200).json(supports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao buscar chamados."],
    });
  }
};

const getAllSupportTickets = async (req, res) => {
  const { status, category, priority } = req.query;

  try {
    if (!isAdminUser(req.user)) {
      return res.status(403).json({
        errors: ["Acesso negado."],
      });
    }

    const query = {};

    if (req.user.role !== "SUPER_ADMIN") {
      query.company = getCompanyId(req.user);
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const supports = await Support.find(query)
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .populate("openedBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(200).json(supports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao buscar chamados de suporte."],
    });
  }
};

const getSupportTicketById = async (req, res) => {
  const { id } = req.params;

  try {
    const support = await Support.findById(id)
      .populate("openedBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!support) {
      return res.status(404).json({
        errors: ["Chamado não encontrado."],
      });
    }

    const isOwner =
      support.openedBy?._id?.toString() === req.user._id.toString();

    const sameCompany =
      support.company?.toString() === getCompanyId(req.user)?.toString();

    if (!isOwner && req.user.role !== "SUPER_ADMIN" && !sameCompany) {
      return res.status(403).json({
        errors: ["Acesso negado."],
      });
    }

    res.status(200).json(support);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao buscar chamado."],
    });
  }
};

const addSupportMessage = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const support = await Support.findById(id);

    if (!support) {
      return res.status(404).json({
        errors: ["Chamado não encontrado."],
      });
    }

    const isOwner = support.openedBy.toString() === req.user._id.toString();
    const isAdmin = isAdminUser(req.user);

    const sameCompany =
      support.company?.toString() === getCompanyId(req.user)?.toString();

    const canAccess =
      isOwner || req.user.role === "SUPER_ADMIN" || (isAdmin && sameCompany);

    if (!canAccess) {
      return res.status(403).json({
        errors: ["Acesso negado."],
      });
    }

    if (support.status === "CLOSED" || support.status === "CANCELED") {
      return res.status(400).json({
        errors: ["Não é possível responder um chamado finalizado."],
      });
    }

    support.messages.push({
      sender: req.user._id,
      senderName: req.user.name,
      senderEmail: req.user.email,
      senderRole: req.user.role || "USER",
      message,
      readByAdmin: isAdmin,
      readByUser: isOwner,
    });

    support.lastMessageAt = new Date();

    // Qualquer mensagem em chamado ativo move/mantém em andamento
    support.status = "IN_PROGRESS";

    // Se quem respondeu foi suporte/admin, assume o atendimento
    if (isAdmin) {
      support.assignedTo = req.user._id;
    }

    // Se quem respondeu foi usuário/admin dono do chamado, notifica suporte
    if (!isAdmin) {
      notifySuperAdmin({
        support,
        reqUser: req.user,
        message,
      });
    }

    await support.save();

    const updatedSupport = await Support.findById(support._id)
      .populate("openedBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(200).json({
      message: "Mensagem enviada com sucesso.",
      support: updatedSupport,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao enviar mensagem."],
    });
  }
};

const updateSupportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!isAdminUser(req.user)) {
      return res.status(403).json({
        errors: ["Acesso negado."],
      });
    }

    const support = await Support.findById(id);

    if (!support) {
      return res.status(404).json({
        errors: ["Chamado não encontrado."],
      });
    }

    const sameCompany =
      support.company?.toString() === getCompanyId(req.user)?.toString();

    if (req.user.role !== "SUPER_ADMIN" && !sameCompany) {
      return res.status(403).json({
        errors: ["Acesso negado."],
      });
    }

    support.status = status;

    if (status === "CLOSED" || status === "CANCELED") {
      support.closedAt = new Date();
    } else {
      support.closedAt = undefined;
    }

    if (status === "IN_PROGRESS") {
      support.assignedTo = req.user._id;
    }

    await support.save();

    const updatedSupport = await Support.findById(support._id)
      .populate("openedBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(200).json({
      message: "Status atualizado com sucesso.",
      support: updatedSupport,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao atualizar status do chamado."],
    });
  }
};

const getNextTicketNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "support_ticket" },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true },
  );

  return counter.sequence;
};

const markSupportTicketAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const support = await Support.findById(id);

    if (!support) {
      return res.status(404).json({
        errors: ["Chamado não encontrado."],
      });
    }

    const isOwner = support.openedBy.toString() === req.user._id.toString();
    const isAdmin = isAdminUser(req.user);

    const sameCompany =
      support.company?.toString() === getCompanyId(req.user)?.toString();

    const canAccess =
      isOwner || req.user.role === "SUPER_ADMIN" || (isAdmin && sameCompany);

    if (!canAccess) {
      return res.status(403).json({
        errors: ["Acesso negado."],
      });
    }

    support.messages = support.messages.map((message) => {
      if (isAdmin) {
        message.readByAdmin = true;
      }

      if (isOwner) {
        message.readByUser = true;
      }

      return message;
    });

    await support.save();

    const updatedSupport = await Support.findById(support._id)
      .populate("openedBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(200).json({
      message: "Chamado marcado como lido.",
      support: updatedSupport,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao marcar chamado como lido."],
    });
  }
};

module.exports = {
  getCompanyId,
  isAdminUser,
  translateCategory,
  notifySuperAdmin,
  createSupportTicket,
  getMySupportTickets,
  getAllSupportTickets,
  getSupportTicketById,
  addSupportMessage,
  updateSupportStatus,
  getNextTicketNumber,
  markSupportTicketAsRead,
};
