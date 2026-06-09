import { api, requestConfig } from "../utils/config";

//Create user
const createUser = async (data, token) => {
  const config = requestConfig("POST", data, token);

  try {
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//Get logged user details
const profile = async (data, token) => {
  const config = requestConfig("GET", data, token);

  try {
    const res = await fetch(api + "/users/profile", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//Update user details
const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true);

  try {
    const res = await fetch(api + "/users/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

//Get user details
const getUserDetails = async (id) => {
  const config = requestConfig("GET");

  try {
    const res = await fetch(api + "/users/" + id, config)
      .then((res) => res.json)
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/users", config);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (id, data, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/users/" + id, config);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (id, token) => {
  const config = requestConfig("DELETE", null, token);

  try {
    const res = await fetch(api + "/users/" + id, config);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

const userService = {
  profile,
  updateProfile,
  getUserDetails,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
};

export default userService;
