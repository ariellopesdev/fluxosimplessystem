const Product = require("../models/Product");

const mongoose = require("mongoose");

// Create a product
const createProduct = async (req, res) => {
  const { name, stock, unityPrice } = req.body;

  const totalPrice = Number(stock) * Number(unityPrice);

  let productImage = null;

  if (req.file) {
    productImage = req.file.filename;
  }

  const reqUser = req.user;

  // Check if product already exists in same company
  const productExists = await Product.findOne({
    name,
    cnpj: reqUser.company.cnpj,
  });

  if (productExists) {
    res.status(422).json({
      errors: ["Este produto já está cadastrado para esta empresa."],
    });

    return;
  }

  // Create product
  const newProduct = await Product.create({
    name,
    stock,
    unityPrice,
    totalPrice,
    productImage,
    company: req.user.company,
    cnpj: req.user.cnpj,
  });

  // Error handling
  if (!newProduct) {
    res.status(422).json({
      errors: ["Houve um erro, tente novamente mais tarde."],
    });

    return;
  }

  res.status(201).json(newProduct);
};

// Get all products
const getAllProducts = async (req, res) => {
  const reqUser = req.user;

  const products = await Product.find({
    company: reqUser.company._id,
  })
    .sort([["createdAt", -1]])
    .populate("company");

  res.status(200).json(products);
};

// Get product by id
const getProductById = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const product = await Product.findById(
      new mongoose.Types.ObjectId(id),
    ).populate("company");

    // Check if product exists
    if (!product) {
      res.status(404).json({
        errors: ["Produto não encontrado."],
      });

      return;
    }

    // Check ownership
    if (product.company._id.toString() !== reqUser.company._id.toString()) {
      res.status(403).json({
        errors: ["Acesso negado."],
      });

      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      errors: ["Produto não encontrado."],
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  const { name, stock, unityPrice } = req.body;

  const totalPrice = Number(stock) * Number(unityPrice);

  let image = null;

  if (req.file) {
    image = req.file.filename;
  }

  const reqUser = req.user;

  const product = await Product.findById(new mongoose.Types.ObjectId(id));

  // Check if product exists
  if (!product) {
    res.status(404).json({
      errors: ["Produto não encontrado."],
    });

    return;
  }

  // Check if product belongs to company
  if (product.company.toString() !== reqUser.company._id.toString()) {
    res.status(403).json({
      errors: ["Acesso negado."],
    });

    return;
  }

  // UPDATE FIELDS
  if (name) {
    product.name = name;
  }

  if (stock !== undefined) {
    product.stock = stock;
  }

  if (unityPrice !== undefined) {
    product.unityPrice = unityPrice;
  }

  // recalcula automaticamente
  product.totalPrice = totalPrice;

  // update image
  if (image) {
    product.productImage = image;
  }

  await product.save();

  const updatedProduct = await Product.findById(product._id).populate(
    "company",
  );

  res.status(200).json(updatedProduct);
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404).json({
      errors: ["Produto não encontrado."],
    });

    return;
  }

  await Product.findByIdAndDelete(product._id);

  res.status(200).json({
    id: product._id,
    message: "Produto excluído com sucesso.",
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
