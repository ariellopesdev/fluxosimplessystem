const backendUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_DEV_URL
    : process.env.REACT_APP_API_PROD_URL;

export const api = `${backendUrl}/api`;
export const uploads = `${backendUrl}/uploads`;

export const requestConfig = (method, data, token = null, image = null) => {
  let config;

  if (image) {
    config = {
      method,
      body: data,
      headers: {},
    };
  } else if (method === "DELETE" || data === null) {
    config = {
      method,
      headers: {},
    };
  } else {
    config = {
      method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
