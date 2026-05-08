const Product = require("../models/Product");

const mongoose = require("mongoose");

// Insert a product
const insertProduct = async (req, res) => {
  const { name, description, price } = req.body;

  let image = null;

  if (req.file) {
    image = req.file.filename;
  }

  const reqUser = req.user;

  // Get authenticated user
  const user = reqUser;

  // Check if product already exists in same company/cnpj
  const productExists = await Product.findOne({
    name,
    cnpj: user.company.cnpj,
  });

  if (productExists) {
    res.status(422).json({
      errors: ["Este produto já foi cadastrado para esta empresa."],
    });

    return;
  }

  // Create product
  const newProduct = await Product.create({
    name,
    description,
    price,
    image,
    company: user.company._id,
    cnpj: user.company.cnpj,
  });

  // Error handling
  if (!newProduct) {
    res.status(422).json({
      errors: ["Houve um erro, por favor tente novamente mais tarde."],
    });

    return;
  }

  res.status(201).json(newProduct);
};

// Get all products
const getAllProducts = async (req, res) => {
  const products = await Product.find({})
    .sort([["createdAt", -1]])
    .populate("company");

  res.status(200).json(products);
};

// Get product by id
const getProductById = async (req, res) => {
  const { id } = req.params;

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

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      errors: ["Produto não encontrado."],
    });

    return;
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

  const product = await Product.findById(
    new mongoose.Types.ObjectId(id),
  );

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

  const product = await Product.findById(
    new mongoose.Types.ObjectId(id),
  );

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