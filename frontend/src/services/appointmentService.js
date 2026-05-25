import { api, requestConfig } from "../utils/config";

// Create appointment
const createAppointment = async (data, token) => {
  const config = requestConfig("POST", data, token);

  try {
    const res = await fetch(api + "/appointments", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get all appointments
const getAllAppointments = async (filters, token) => {
  const config = requestConfig("GET", null, token);

  let query = "";

  if (filters) {
    const params = new URLSearchParams();

    if (filters.date) params.append("date", filters.date);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.status) params.append("status", filters.status);
    if (filters.type) params.append("type", filters.type);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.client) params.append("client", filters.client);
    if (filters.search) params.append("search", filters.search);

    query = `?${params.toString()}`;
  }

  try {
    const res = await fetch(api + "/appointments" + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get appointment by id
const getAppointmentById = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/appointments/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Update appointment
const updateAppointment = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/appointments/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Delete appointment
const deleteAppointment = async (id, token) => {
  const config = requestConfig("DELETE", null, token);

  try {
    const res = await fetch(api + "/appointments/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get appointment summary
const getAppointmentSummary = async (token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/appointments/summary", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const appointmentService = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentSummary,
};

export default appointmentService;