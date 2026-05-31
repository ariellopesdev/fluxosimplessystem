import { api, requestConfig } from "../utils/config";

// Get dashboard by filters
const getDashboard = async (filters, token) => {
  const params = new URLSearchParams();

  if (filters?.period) {
    params.append("period", filters.period);
  }

  if (filters?.startDate) {
    params.append("startDate", filters.startDate);
  }

  if (filters?.endDate) {
    params.append("endDate", filters.endDate);
  }

  const query = params.toString() ? `?${params.toString()}` : "";

  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/dashboard" + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get latest dashboard
const getLatestDashboard = async (token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/dashboard/latest", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Delete dashboard
const deleteDashboard = async (id, token) => {
  const config = requestConfig("DELETE", null, token);

  try {
    const res = await fetch(api + "/dashboard/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const dashboardService = {
  getDashboard,
  getLatestDashboard,
  deleteDashboard,
};

export default dashboardService;