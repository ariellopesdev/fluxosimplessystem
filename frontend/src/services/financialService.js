import { api, requestConfig } from "../utils/config";

// Create financial
const createFinancial = async (data, token) => {
  const config = requestConfig("POST", data, token);

  try {
    const res = await fetch(api + "/financials", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get all financials
const getAllFinancials = async (filters, token) => {
  const config = requestConfig("GET", null, token);

  let query = "";

  if (filters) {
    const params = new URLSearchParams();

    if (filters.type) params.append("type", filters.type);
    if (filters.category) params.append("category", filters.category);
    if (filters.paymentStatus)
      params.append("paymentStatus", filters.paymentStatus);
    if (filters.paymentMethod)
      params.append("paymentMethod", filters.paymentMethod);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.search) params.append("search", filters.search);

    query = `?${params.toString()}`;
  }

  try {
    const res = await fetch(api + "/financials" + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get financial by id
const getFinancialById = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/financials/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Update financial
const updateFinancial = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/financials/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Delete financial
const deleteFinancial = async (id, token) => {
  const config = requestConfig("DELETE", null, token);

  try {
    const res = await fetch(api + "/financials/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get financial summary
const getFinancialSummary = async (filters, token) => {
  const config = requestConfig("GET", null, token);

  let query = "";

  if (filters) {
    const params = new URLSearchParams();

    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    query = `?${params.toString()}`;
  }

  try {
    const res = await fetch(api + "/financials/summary" + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const financialService = {
  createFinancial,
  getAllFinancials,
  getFinancialById,
  updateFinancial,
  deleteFinancial,
  getFinancialSummary,
};

export default financialService;