const Service = require("../models/Service");

const mongoose = require("mongoose");

// Create a service
const createService = async (req, res) => {
  const {
    name,
    description,
    unityPrice,
    estimatedDurationValue,
    estimatedDurationUnit,
    category,
    status,
    isSchedulable,
    isSellable,
    requiresClient,
    notes,
  } = req.body;

  const validCategories = [
    "SERVICE",
    "CONSULTATION",
    "INSTALLATION",
    "MAINTENANCE",
    "DELIVERY",
    "SUPPORT",
    "OTHER",
  ];

  const validStatus = ["ACTIVE", "INACTIVE"];
  const validDurationUnits = ["MINUTES", "HOURS", "DAYS"];

  if (category && !validCategories.includes(category)) {
    return res.status(422).json({
      errors: ["Categoria inválida."],
    });
  }

  if (status && !validStatus.includes(status)) {
    return res.status(422).json({
      errors: ["Status inválido."],
    });
  }

  if (
    estimatedDurationUnit &&
    !validDurationUnits.includes(estimatedDurationUnit)
  ) {
    return res.status(422).json({
      errors: ["Unidade de duração inválida."],
    });
  }

  const reqUser = req.user;

  const serviceExists = await Service.findOne({
    name,
    cnpj: reqUser.company.cnpj,
  });

  if (serviceExists) {
    return res.status(422).json({
      errors: ["Este serviço já está cadastrado para esta empresa."],
    });
  }

  const newService = await Service.create({
    name,
    description,
    unityPrice,

    estimatedDuration: {
      value: estimatedDurationValue,
      unit: estimatedDurationUnit || "HOURS",
    },

    category: category || "SERVICE",
    status: status || "ACTIVE",

    isSchedulable:
      isSchedulable === undefined ? true : isSchedulable,

    isSellable:
      isSellable === undefined ? true : isSellable,

    requiresClient:
      requiresClient === undefined ? true : requiresClient,

    company: reqUser.company._id,
    cnpj: reqUser.company.cnpj,

    notes,
  });

  if (!newService) {
    return res.status(422).json({
      errors: ["Houve um erro, tente novamente mais tarde."],
    });
  }

  res.status(201).json(newService);
};

// Get all services
const getAllServices = async (req, res) => {
  const reqUser = req.user;

  const services = await Service.find({
    company: reqUser.company._id,
  })
    .sort([["createdAt", -1]])
    .populate("company");

  res.status(200).json(services);
};

// Get service by id
const getServiceById = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const service = await Service.findById(
      new mongoose.Types.ObjectId(id),
    ).populate("company");

    if (!service) {
      return res.status(404).json({
        errors: ["Serviço não encontrado."],
      });
    }

    if (service.company._id.toString() !== reqUser.company._id.toString()) {
      return res.status(403).json({
        errors: ["Acesso negado."],
      });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(404).json({
      errors: ["Serviço não encontrado."],
    });
  }
};

// Update a service
const updateService = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    description,
    unityPrice,
    estimatedDurationValue,
    estimatedDurationUnit,
    category,
    status,
    isSchedulable,
    isSellable,
    requiresClient,
    notes,
  } = req.body;

  const validCategories = [
    "SERVICE",
    "CONSULTATION",
    "INSTALLATION",
    "MAINTENANCE",
    "DELIVERY",
    "SUPPORT",
    "OTHER",
  ];

  const validStatus = ["ACTIVE", "INACTIVE"];
  const validDurationUnits = ["MINUTES", "HOURS", "DAYS"];

  if (category && !validCategories.includes(category)) {
    return res.status(422).json({
      errors: ["Categoria inválida."],
    });
  }

  if (status && !validStatus.includes(status)) {
    return res.status(422).json({
      errors: ["Status inválido."],
    });
  }

  if (
    estimatedDurationUnit &&
    !validDurationUnits.includes(estimatedDurationUnit)
  ) {
    return res.status(422).json({
      errors: ["Unidade de duração inválida."],
    });
  }

  const reqUser = req.user;

  const service = await Service.findById(new mongoose.Types.ObjectId(id));

  if (!service) {
    return res.status(404).json({
      errors: ["Serviço não encontrado."],
    });
  }

  if (service.company.toString() !== reqUser.company._id.toString()) {
    return res.status(403).json({
      errors: ["Acesso negado."],
    });
  }

  if (name && name !== service.name) {
    const serviceExists = await Service.findOne({
      name,
      cnpj: reqUser.company.cnpj,
      _id: { $ne: service._id },
    });

    if (serviceExists) {
      return res.status(422).json({
        errors: ["Este serviço já está cadastrado para esta empresa."],
      });
    }

    service.name = name;
  }

  if (description !== undefined) {
    service.description = description;
  }

  if (unityPrice !== undefined) {
    service.unityPrice = unityPrice;
  }

  if (estimatedDurationValue !== undefined) {
    service.estimatedDuration.value = estimatedDurationValue;
  }

  if (estimatedDurationUnit) {
    service.estimatedDuration.unit = estimatedDurationUnit;
  }

  if (category) {
    service.category = category;
  }

  if (status) {
    service.status = status;
  }

  if (isSchedulable !== undefined) {
    service.isSchedulable = isSchedulable;
  }

  if (isSellable !== undefined) {
    service.isSellable = isSellable;
  }

  if (requiresClient !== undefined) {
    service.requiresClient = requiresClient;
  }

  if (notes !== undefined) {
    service.notes = notes;
  }

  await service.save();

  const updatedService = await Service.findById(service._id).populate(
    "company",
  );

  res.status(200).json(updatedService);
};

// Delete a service
const deleteService = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const service = await Service.findById(id);

  if (!service) {
    return res.status(404).json({
      errors: ["Serviço não encontrado."],
    });
  }

  if (service.company.toString() !== reqUser.company._id.toString()) {
    return res.status(403).json({
      errors: ["Acesso negado."],
    });
  }

  await Service.findByIdAndDelete(service._id);

  res.status(200).json({
    id: service._id,
    message: "Serviço excluído com sucesso.",
  });
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};