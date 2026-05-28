const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");
const Client = require("../models/Client");

// Create appointment
const createAppointment = async (req, res) => {
  const {
    title,
    description,
    date,
    startTime,
    endTime,
    type,
    status,
    priority,
    client,
    payment,
    discount,
    total,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipCode,
    contactName,
    contactPhone,
    contactEmail,
    notes,
    reminderEnabled,
    remindAt,
  } = req.body;

  const reqUser = req.user;

  let selectedClient = null;

  if (client) {
    selectedClient = await Client.findById(client);

    if (!selectedClient) {
      return res.status(404).json({
        errors: ["Cliente não encontrado."],
      });
    }

    if (
      selectedClient.company &&
      selectedClient.company.toString() !== reqUser.company._id.toString()
    ) {
      return res.status(403).json({
        errors: ["Acesso negado ao cliente informado."],
      });
    }
  }

  const appointment = await Appointment.create({
    title,
    description,

    date,
    startTime,
    endTime,

    type: type || "OTHER",
    status: status || "PENDING",
    priority: priority || "MEDIUM",

    payment: {
      method: payment?.method || "PIX",
      status: payment?.status || "PENDING",
      installments:
        payment?.method === "CREDIT_CARD"
          ? Number(payment?.installments || 1)
          : 1,
    },

    discount: Number(discount || 0),
    total: Number(total || 0),

    client: selectedClient ? selectedClient._id : null,
    responsible: reqUser._id,
    company: reqUser.company._id,

    location: {
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
    },

    contact: {
      name: contactName,
      phone: contactPhone,
      email: contactEmail,
    },

    notes,

    reminder: {
      enabled: reminderEnabled || false,
      remindAt,
    },
  });

  if (!appointment) {
    return res.status(422).json({
      errors: ["Houve um erro ao criar o agendamento."],
    });
  }

  res.status(201).json(appointment);
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  const reqUser = req.user;

  const { date, startDate, endDate, status, type, priority, client, search } =
    req.query;

  const query = {
    company: reqUser.company._id,
  };

  if (date) {
    const selectedDate = new Date(date);
    const nextDate = new Date(date);

    nextDate.setDate(nextDate.getDate() + 1);

    query.date = {
      $gte: selectedDate,
      $lt: nextDate,
    };
  }

  if (startDate || endDate) {
    query.date = {};

    if (startDate) {
      query.date.$gte = new Date(startDate);
    }

    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }

  if (status) {
    query.status = status;
  }

  if (type) {
    query.type = type;
  }

  if (priority) {
    query.priority = priority;
  }

  if (client) {
    query.client = client;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
      { "contact.name": { $regex: search, $options: "i" } },
      { "contact.phone": { $regex: search, $options: "i" } },
    ];
  }

  const appointments = await Appointment.find(query)
    .populate("client", "name email cpfCnpj phones address")
    .populate("responsible", "name email")
    .sort({ date: 1, startTime: 1 });

  res.status(200).json(appointments);
};

// Get appointment by id
const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      errors: ["Agendamento não encontrado."],
    });
  }

  const appointment = await Appointment.findById(id)
    .populate("client", "name email cpfCnpj phones address")
    .populate("responsible", "name email")
    .populate("company", "name cnpj");

  if (!appointment) {
    return res.status(404).json({
      errors: ["Agendamento não encontrado."],
    });
  }

  if (appointment.company._id.toString() !== reqUser.company._id.toString()) {
    return res.status(403).json({
      errors: ["Acesso negado."],
    });
  }

  res.status(200).json(appointment);
};

// Update appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    date,
    startTime,
    endTime,
    type,
    status,
    priority,
    client,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipCode,
    contactName,
    contactPhone,
    contactEmail,
    payment,
    discount,
    total,
    notes,
    reminderEnabled,
    remindAt,
    cancelReason,
  } = req.body;

  const reqUser = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      errors: ["Agendamento não encontrado."],
    });
  }

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return res.status(404).json({
      errors: ["Agendamento não encontrado."],
    });
  }

  if (appointment.company.toString() !== reqUser.company._id.toString()) {
    return res.status(403).json({
      errors: ["Acesso negado."],
    });
  }

  if (client) {
    const selectedClient = await Client.findById(client);

    if (!selectedClient) {
      return res.status(404).json({
        errors: ["Cliente não encontrado."],
      });
    }

    if (
      selectedClient.company &&
      selectedClient.company.toString() !== reqUser.company._id.toString()
    ) {
      return res.status(403).json({
        errors: ["Acesso negado ao cliente informado."],
      });
    }

    appointment.client = selectedClient._id;
  }

  if (title) appointment.title = title;
  if (description !== undefined) appointment.description = description;
  if (date) appointment.date = date;
  if (startTime) appointment.startTime = startTime;
  if (endTime !== undefined) appointment.endTime = endTime;
  if (type) appointment.type = type;
  if (priority) appointment.priority = priority;
  if (notes !== undefined) appointment.notes = notes;
  if (payment !== undefined) {
    appointment.payment = {
      method: payment?.method || appointment.payment?.method || "PIX",
      status: payment?.status || appointment.payment?.status || "PENDING",
      installments:
        payment?.method === "CREDIT_CARD"
          ? Number(payment?.installments || 1)
          : 1,
    };
  }

  if (discount !== undefined) {
    appointment.discount = Number(discount || 0);
  }

  if (total !== undefined) {
    appointment.total = Number(total || 0);
  }
  if (street !== undefined) appointment.location.street = street;
  if (number !== undefined) appointment.location.number = number;
  if (complement !== undefined) appointment.location.complement = complement;
  if (neighborhood !== undefined)
    appointment.location.neighborhood = neighborhood;
  if (city !== undefined) appointment.location.city = city;
  if (state !== undefined) appointment.location.state = state;
  if (zipCode !== undefined) appointment.location.zipCode = zipCode;

  if (contactName !== undefined) appointment.contact.name = contactName;
  if (contactPhone !== undefined) appointment.contact.phone = contactPhone;
  if (contactEmail !== undefined) appointment.contact.email = contactEmail;

  if (reminderEnabled !== undefined) {
    appointment.reminder.enabled = reminderEnabled;
  }

  if (remindAt !== undefined) {
    appointment.reminder.remindAt = remindAt;
  }

  if (status) {
    appointment.status = status;

    if (status === "FINISHED") {
      appointment.completedAt = new Date();
      appointment.cancelledAt = null;
      appointment.cancelReason = "";
    }

    if (status === "CANCELLED") {
      appointment.cancelledAt = new Date();
      appointment.completedAt = null;
      appointment.cancelReason = cancelReason || appointment.cancelReason;
    }

    if (status === "PENDING" || status === "CONFIRMED") {
      appointment.completedAt = null;
      appointment.cancelledAt = null;
      appointment.cancelReason = "";
    }
  }

  await appointment.save();

  const updatedAppointment = await Appointment.findById(appointment._id)
    .populate("client", "name email cpfCnpj phones address")
    .populate("responsible", "name email");

  res.status(200).json(updatedAppointment);
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      errors: ["Agendamento não encontrado."],
    });
  }

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return res.status(404).json({
      errors: ["Agendamento não encontrado."],
    });
  }

  if (appointment.company.toString() !== reqUser.company._id.toString()) {
    return res.status(403).json({
      errors: ["Acesso negado."],
    });
  }

  await Appointment.findByIdAndDelete(id);

  res.status(200).json({
    id,
    message: "Agendamento removido com sucesso.",
  });
};

// Get appointment summary
const getAppointmentSummary = async (req, res) => {
  const reqUser = req.user;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = await Appointment.countDocuments({
    company: reqUser.company._id,
    date: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  const pendingAppointments = await Appointment.countDocuments({
    company: reqUser.company._id,
    status: "PENDING",
  });

  const finishedAppointments = await Appointment.countDocuments({
    company: reqUser.company._id,
    status: "FINISHED",
  });

  const cancelledAppointments = await Appointment.countDocuments({
    company: reqUser.company._id,
    status: "CANCELLED",
  });

  res.status(200).json({
    today: todayAppointments,
    pending: pendingAppointments,
    finished: finishedAppointments,
    cancelled: cancelledAppointments,
  });
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentSummary,
};
