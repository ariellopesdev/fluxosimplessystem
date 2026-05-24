const Client = require("../models/Client");

const mongoose = require("mongoose");

// Create a client
const createClient = async (req, res) => {
  const {
    name,
    email,
    cpfCnpj,
    type,
    notes,
    financial,

    primaryPhone,
    secondaryPhone,
    emergencyPhone,

    street,
    number,
    neighborhood,
    city,
    state,
    zipCode,
  } = req.body;

  // Check if client already exists
  const clientExists = await Client.findOne({
    cpfCnpj,
  });

  if (cpfCnpj && clientExists) {
    res.status(422).json({
      errors: ["Este cliente já está cadastrado."],
    });

    return;
  }

  // Create client
  const newClient = await Client.create({
    name,
    email,
    cpfCnpj,
    type,
    notes,
    financial,

    phones: {
      primary: primaryPhone,
      secondary: secondaryPhone,
      emergency: emergencyPhone,
    },

    address: {
      street,
      number,
      neighborhood,
      city,
      state,
      zipCode,
    },
  });

  // Error handling
  if (!newClient) {
    res.status(422).json({
      errors: ["Houve um erro, tente novamente mais tarde."],
    });

    return;
  }

  res.status(201).json(newClient);
};

// Get all clients
const getAllClients = async (req, res) => {
  const clients = await Client.find().sort([
    ["createdAt", -1],
  ]);

  res.status(200).json(clients);
};

// Get client by id
const getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findById(
      new mongoose.Types.ObjectId(id),
    );

    // Check if client exists
    if (!client) {
      res.status(404).json({
        errors: ["Cliente não encontrado."],
      });

      return;
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(404).json({
      errors: ["Cliente não encontrado."],
    });
  }
};

// Update a client
const updateClient = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    email,
    cpfCnpj,
    type,
    notes,
    financial,

    primaryPhone,
    secondaryPhone,
    emergencyPhone,

    street,
    number,
    neighborhood,
    city,
    state,
    zipCode,
  } = req.body;

  const client = await Client.findById(
    new mongoose.Types.ObjectId(id),
  );

  // Check if client exists
  if (!client) {
    res.status(404).json({
      errors: ["Cliente não encontrado."],
    });

    return;
  }

  // UPDATE FIELDS
  if (name) {
    client.name = name;
  }

  if (email) {
    client.email = email;
  }

  if (cpfCnpj) {
    client.cpfCnpj = cpfCnpj;
  }

  if (type) {
    client.type = type;
  }

  if (notes) {
    client.notes = notes;
  }

  if (financial) {
    client.financial = financial;
  }

  // Phones
  client.phones = {
    primary: primaryPhone || client.phones.primary,
    secondary: secondaryPhone || client.phones.secondary,
    emergency: emergencyPhone || client.phones.emergency,
  };

  // Address
  client.address = {
    street: street || client.address.street,
    number: number || client.address.number,
    neighborhood:
      neighborhood || client.address.neighborhood,
    city: city || client.address.city,
    state: state || client.address.state,
    zipCode: zipCode || client.address.zipCode,
  };

  await client.save();

  const updatedClient = await Client.findById(client._id);

  res.status(200).json(updatedClient);
};

// Delete a client
const deleteClient = async (req, res) => {
  const { id } = req.params;

  const client = await Client.findById(id);

  if (!client) {
    res.status(404).json({
      errors: ["Cliente não encontrado."],
    });

    return;
  }

  await Client.findByIdAndDelete(client._id);

  res.status(200).json({
    id: client._id,
    message: "Cliente excluído com sucesso.",
  });
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};