const Product = require("../models/Product");

const mongoose = require("mongoose");

// Create a product
const createProduct = async (req, res) => {
  const { name, description, price } = req.body;

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
    description,
    price,
    productImage,
    company: reqUser.company._id,
    cnpj: reqUser.company.cnpj,
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

  const { name, description, price } = req.body;

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

  if (name) {
    product.name = name;
  }

  if (description) {
    product.description = description;
  }

  if (price) {
    product.price = price;
  }

  if (image) {
    product.image = image;
  }

  await product.save();

  res.status(200).json(product);
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

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

  await Product.findByIdAndDelete(product._id);

  res.status(200).json({
    id: product._id,
    message: "Produto excluído com sucesso.",
  });
};

module.exports = {
  insertProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
