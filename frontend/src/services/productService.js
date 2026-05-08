import { api, requestConfig } from "../utils/config";

// Create a product
const createProduct = async (data, token) => {
  const config = requestConfig("POST", data, token, true);

  try {
    const res = await fetch(api + "/products", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get user products
const getProducts = async (token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/products", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get product by id
const getProductById = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/products/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Update a product
const updateProduct = async (data, id, token) => {
  const config = requestConfig("PUT", data, token, true);

  try {
    const res = await fetch(api + "/products/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Delete a product
const deleteProduct = async (id, token) => {
  const config = requestConfig("DELETE", null, token);

  try {
    const res = await fetch(api + "/products/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const productService = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

export default productService;