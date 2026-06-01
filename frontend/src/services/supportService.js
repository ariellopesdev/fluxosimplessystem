import { api, requestConfig } from "../utils/config";

// Create support ticket
const createSupportTicket = async (data, token) => {
  const config = requestConfig("POST", data, token);

  try {
    const res = await fetch(api + "/support", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get my support tickets
const getMySupportTickets = async (token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/support/my", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get all support tickets - admin/super admin
const getAllSupportTickets = async (filters, token) => {
  const params = new URLSearchParams();

  if (filters?.status) {
    params.append("status", filters.status);
  }

  if (filters?.category) {
    params.append("category", filters.category);
  }

  if (filters?.priority) {
    params.append("priority", filters.priority);
  }

  const query = params.toString() ? `?${params.toString()}` : "";

  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/support" + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get support ticket by id
const getSupportTicketById = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/support/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Add message to support ticket
const addSupportMessage = async (id, data, token) => {
  const config = requestConfig("POST", data, token);

  try {
    const res = await fetch(api + "/support/" + id + "/messages", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Update support ticket status - admin/super admin
const updateSupportStatus = async (id, data, token) => {
  const config = requestConfig("PATCH", data, token);

  try {
    const res = await fetch(api + "/support/" + id + "/status", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const supportService = {
  createSupportTicket,
  getMySupportTickets,
  getAllSupportTickets,
  getSupportTicketById,
  addSupportMessage,
  updateSupportStatus,
};

export default supportService;