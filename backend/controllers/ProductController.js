const Product = require("../models/Product");
const mongoose = require("mongoose");

// 🔹 CREATE PRODUCT
const createProduct = async (req, res) => {
  const { name, quantity, price, description, category } = req.body;

  let image = null;

  if (req.file) {
    image = req.file.filename;
  }

  try {
    const product = await Product.create({
      name,
      quantity,
      price,
      description,
      category,
      image,
      company: req.user.company, // 🔥 vínculo com empresa
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ errors: ["Erro ao criar produto."] });
  }
};

// 🔹 GET ALL PRODUCTS (da empresa)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      company: req.user.company,
    }).sort("-createdAt");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ errors: ["Erro ao buscar produtos."] });
  }
};

// 🔹 GET PRODUCT BY ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({
      _id: id,
      company: req.user.company,
    });

    if (!product) {
      return res.status(404).json({ errors: ["Produto não encontrado."] });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ errors: ["Produto não encontrado."] });
  }
};

// 🔹 UPDATE PRODUCT
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, description, category } = req.body;

  let image = null;

  if (req.file) {
    image = req.file.filename;
  }

  try {
    const product = await Product.findOne({
      _id: id,
      company: req.user.company,
    });

    if (!product) {
      return res.status(404).json({ errors: ["Produto não encontrado."] });
    }

    if (name) product.name = name;
    if (quantity) product.quantity = quantity;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (image) product.image = image;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ errors: ["Erro ao atualizar produto."] });
  }
};

// 🔹 DELETE PRODUCT
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOneAndDelete({
      _id: id,
      company: req.user.company,
    });

    if (!product) {
      return res.status(404).json({ errors: ["Produto não encontrado."] });
    }

    res.status(200).json({ message: "Produto removido com sucesso." });
  } catch (error) {
    res.status(500).json({ errors: ["Erro ao deletar produto."] });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};