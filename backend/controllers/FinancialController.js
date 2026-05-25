const Financial = require("../models/Financial");

const mongoose = require("mongoose");

// Create financial record
const createFinancial = async (req, res) => {
  const {
    title,
    description,
    type,
    category,
    amount,
    payment,
    origin,
    notes,
    isRecurring,
    recurrence,
  } = req.body;

  const reqUser = req.user;

  const validTypes = ["INCOME", "EXPENSE", "ASSET"];

  const validCategories = [
    "SALE",
    "PRODUCT_PURCHASE",
    "PRODUCT_ASSET",
    "COMPANY_ASSET",
    "MAINTENANCE",
    "TAX",
    "SALARY",
    "RENT",
    "UTILITY",
    "OTHER",
  ];

  const validPaymentMethods = [
    "CASH",
    "PIX",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "BANK_SLIP",
    "TRANSFER",
  ];

  const validPaymentStatus = ["PENDING", "PAID", "CANCELLED"];

  const validRecurrenceFrequency = [
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "YEARLY",
    "NONE",
  ];

  if (type && !validTypes.includes(type)) {
    res.status(422).json({
      errors: ["Tipo financeiro inválido."],
    });

    return;
  }

  if (category && !validCategories.includes(category)) {
    res.status(422).json({
      errors: ["Categoria financeira inválida."],
    });

    return;
  }

  if (payment?.method && !validPaymentMethods.includes(payment.method)) {
    res.status(422).json({
      errors: ["Método de pagamento inválido."],
    });

    return;
  }

  if (payment?.status && !validPaymentStatus.includes(payment.status)) {
    res.status(422).json({
      errors: ["Status de pagamento inválido."],
    });

    return;
  }

  if (
    recurrence?.frequency &&
    !validRecurrenceFrequency.includes(recurrence.frequency)
  ) {
    res.status(422).json({
      errors: ["Frequência de recorrência inválida."],
    });

    return;
  }

  if (amount !== undefined && Number(amount) < 0) {
    res.status(422).json({
      errors: ["O valor não pode ser negativo."],
    });

    return;
  }

  const financial = await Financial.create({
    title,
    description,
    type,
    category,
    amount: Number(amount || 0),

    payment: {
      method: payment?.method || "PIX",
      status: payment?.status || "PENDING",
      installments: Number(payment?.installments || 1),
      paidAt: payment?.paidAt || null,
      dueDate: payment?.dueDate || null,
    },

    origin: {
      sale: origin?.sale || null,
      product: origin?.product || null,
      client: origin?.client || null,
    },

    company: reqUser.company._id,
    createdBy: reqUser._id,

    notes,
    isRecurring: isRecurring || false,

    recurrence: {
      frequency: recurrence?.frequency || "NONE",
      nextDate: recurrence?.nextDate || null,
    },
  });

  if (!financial) {
    res.status(422).json({
      errors: ["Houve um erro, tente novamente mais tarde."],
    });

    return;
  }

  const newFinancial = await Financial.findById(financial._id)
    .populate("company")
    .populate("createdBy")
    .populate("origin.sale")
    .populate("origin.product")
    .populate("origin.client");

  res.status(201).json(newFinancial);
};

// Get all financial records
const getAllFinancials = async (req, res) => {
  const reqUser = req.user;

  const {
    type,
    category,
    paymentStatus,
    paymentMethod,
    startDate,
    endDate,
    search,
  } = req.query;

  const query = {
    company: reqUser.company._id,
  };

  if (type) {
    query.type = type;
  }

  if (category) {
    query.category = category;
  }

  if (paymentStatus) {
    query["payment.status"] = paymentStatus;
  }

  if (paymentMethod) {
    query["payment.method"] = paymentMethod;
  }

  if (startDate || endDate) {
    query.createdAt = {};

    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        notes: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const financials = await Financial.find(query)
    .sort([["createdAt", -1]])
    .populate("company")
    .populate("createdBy")
    .populate("origin.sale")
    .populate("origin.product")
    .populate("origin.client");

  res.status(200).json(financials);
};

// Get financial by id
const getFinancialById = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const financial = await Financial.findById(new mongoose.Types.ObjectId(id))
      .populate("company")
      .populate("createdBy")
      .populate("origin.sale")
      .populate("origin.product")
      .populate("origin.client");

    if (!financial) {
      res.status(404).json({
        errors: ["Registro financeiro não encontrado."],
      });

      return;
    }

    if (financial.company._id.toString() !== reqUser.company._id.toString()) {
      res.status(403).json({
        errors: ["Acesso negado."],
      });

      return;
    }

    res.status(200).json(financial);
  } catch (error) {
    res.status(404).json({
      errors: ["Registro financeiro não encontrado."],
    });
  }
};

// Update financial record
const updateFinancial = async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    type,
    category,
    amount,
    payment,
    origin,
    notes,
    isRecurring,
    recurrence,
  } = req.body;

  const reqUser = req.user;

  const validTypes = ["INCOME", "EXPENSE", "ASSET"];

  const validCategories = [
    "SALE",
    "PRODUCT_PURCHASE",
    "PRODUCT_ASSET",
    "COMPANY_ASSET",
    "MAINTENANCE",
    "TAX",
    "SALARY",
    "RENT",
    "UTILITY",
    "OTHER",
  ];

  const validPaymentMethods = [
    "CASH",
    "PIX",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "BANK_SLIP",
    "TRANSFER",
  ];

  const validPaymentStatus = ["PENDING", "PAID", "CANCELLED"];

  const validRecurrenceFrequency = [
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "YEARLY",
    "NONE",
  ];

  const financial = await Financial.findById(new mongoose.Types.ObjectId(id));

  if (!financial) {
    res.status(404).json({
      errors: ["Registro financeiro não encontrado."],
    });

    return;
  }

  if (financial.company.toString() !== reqUser.company._id.toString()) {
    res.status(403).json({
      errors: ["Acesso negado."],
    });

    return;
  }

  if (type) {
    if (!validTypes.includes(type)) {
      res.status(422).json({
        errors: ["Tipo financeiro inválido."],
      });

      return;
    }

    financial.type = type;
  }

  if (category) {
    if (!validCategories.includes(category)) {
      res.status(422).json({
        errors: ["Categoria financeira inválida."],
      });

      return;
    }

    financial.category = category;
  }

  if (amount !== undefined) {
    if (Number(amount) < 0) {
      res.status(422).json({
        errors: ["O valor não pode ser negativo."],
      });

      return;
    }

    financial.amount = Number(amount);
  }

  if (title !== undefined) {
    financial.title = title;
  }

  if (description !== undefined) {
    financial.description = description;
  }

  if (payment) {
    if (payment.method && !validPaymentMethods.includes(payment.method)) {
      res.status(422).json({
        errors: ["Método de pagamento inválido."],
      });

      return;
    }

    if (payment.status && !validPaymentStatus.includes(payment.status)) {
      res.status(422).json({
        errors: ["Status de pagamento inválido."],
      });

      return;
    }

    if (payment.method) {
      financial.payment.method = payment.method;
    }

    if (payment.status) {
      financial.payment.status = payment.status;
    }

    if (payment.installments !== undefined) {
      financial.payment.installments = Number(payment.installments);
    }

    if (payment.paidAt !== undefined) {
      financial.payment.paidAt = payment.paidAt;
    }

    if (payment.dueDate !== undefined) {
      financial.payment.dueDate = payment.dueDate;
    }

    financial.markModified("payment");
  }

  if (origin) {
    if (origin.sale !== undefined) {
      financial.origin.sale = origin.sale || null;
    }

    if (origin.product !== undefined) {
      financial.origin.product = origin.product || null;
    }

    if (origin.client !== undefined) {
      financial.origin.client = origin.client || null;
    }

    financial.markModified("origin");
  }

  if (notes !== undefined) {
    financial.notes = notes;
  }

  if (isRecurring !== undefined) {
    financial.isRecurring = isRecurring;
  }

  if (recurrence) {
    if (
      recurrence.frequency &&
      !validRecurrenceFrequency.includes(recurrence.frequency)
    ) {
      res.status(422).json({
        errors: ["Frequência de recorrência inválida."],
      });

      return;
    }

    if (recurrence.frequency) {
      financial.recurrence.frequency = recurrence.frequency;
    }

    if (recurrence.nextDate !== undefined) {
      financial.recurrence.nextDate = recurrence.nextDate;
    }

    financial.markModified("recurrence");
  }

  await financial.save();

  const updatedFinancial = await Financial.findById(financial._id)
    .populate("company")
    .populate("createdBy")
    .populate("origin.sale")
    .populate("origin.product")
    .populate("origin.client");

  res.status(200).json(updatedFinancial);
};

// Delete financial record
const deleteFinancial = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const financial = await Financial.findById(id);

  if (!financial) {
    res.status(404).json({
      errors: ["Registro financeiro não encontrado."],
    });

    return;
  }

  if (financial.company.toString() !== reqUser.company._id.toString()) {
    res.status(403).json({
      errors: ["Acesso negado."],
    });

    return;
  }

  await Financial.findByIdAndDelete(financial._id);

  res.status(200).json({
    id: financial._id,
    message: "Registro financeiro excluído com sucesso.",
  });
};

// Get financial summary
const getFinancialSummary = async (req, res) => {
  const reqUser = req.user;

  const { startDate, endDate } = req.query;

  const query = {
    company: reqUser.company._id,
  };

  if (startDate || endDate) {
    query.createdAt = {};

    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const financials = await Financial.find(query);

  const summary = {
    income: 0,
    expense: 0,
    asset: 0,
    pending: 0,
    paid: 0,
    cancelled: 0,
    balance: 0,
    totalRecords: financials.length,
  };

  financials.forEach((item) => {
    const amount = Number(item.amount || 0);

    if (item.type === "INCOME") {
      summary.income += amount;
    }

    if (item.type === "EXPENSE") {
      summary.expense += amount;
    }

    if (item.type === "ASSET") {
      summary.asset += amount;
    }

    if (item.payment?.status === "PENDING") {
      summary.pending += amount;
    }

    if (item.payment?.status === "PAID") {
      summary.paid += amount;
    }

    if (item.payment?.status === "CANCELLED") {
      summary.cancelled += amount;
    }
  });

  summary.balance = summary.income - summary.expense;

  res.status(200).json(summary);
};

module.exports = {
  createFinancial,
  getAllFinancials,
  getFinancialById,
  updateFinancial,
  deleteFinancial,
  getFinancialSummary,
};
