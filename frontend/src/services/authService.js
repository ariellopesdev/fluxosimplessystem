import { api, requestConfig } from "../utils/config";

//Register an user
const register = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/register", config);

    const json = await res.json();

    if (!res.ok) {
      return json;
    }

    if (json) {
      localStorage.setItem("user", JSON.stringify(json));
    }

    return json;
  } catch (error) {
    return {
      errors: [
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
      ],
    };
  }
};

//Logout an user
const logout = () => {
  localStorage.removeItem("user");
};

//Sign in an user
const login = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/login", config);

    const json = await res.json();

    if (!res.ok) {
      return json;
    }

    if (json) {
      localStorage.setItem("user", JSON.stringify(json));
    }

    return json;
  } catch (error) {
    return {
      errors: [
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
      ],
    };
  }
};

// Forgot password
const forgotPassword = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/forgot-password", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Reset password
const resetPassword = async (data, token) => {
  const config = requestConfig("PUT", data);

  try {
    const res = await fetch(api + "/users/reset-password/" + token, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const authService = {
  register,
  logout,
  login,
  forgotPassword,
  resetPassword,
};

export default authService;
