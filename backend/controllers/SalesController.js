const Sale = require("../models/Sales");
const Product = require("../models/Product");

const mongoose = require("mongoose");

// Create a sale
const createSale = async (req, res) => {
  const {
    client,
    customerDocument,
    products,
    payment,
    discount,
    shipping,
    notes,
  } = req.body;

  const reqUser = req.user;

  if (!products || !Array.isArray(products) || products.length === 0) {
    res.status(422).json({
      errors: ["A venda precisa ter pelo menos um produto."],
    });

    return;
  }

  let subtotal = 0;
  const saleProducts = [];

  for (const item of products) {
    const product = await Product.findById(
      new mongoose.Types.ObjectId(item.product),
    );

    if (!product) {
      res.status(404).json({
        errors: ["Produto não encontrado."],
      });

      return;
    }

    if (product.company.toString() !== reqUser.company._id.toString()) {
      res.status(403).json({
        errors: ["Acesso negado a um dos produtos."],
      });

      return;
    }

    if (product.stock < Number(item.quantity)) {
      res.status(422).json({
        errors: [`Estoque insuficiente para ${product.name}.`],
      });

      return;
    }

    const quantity = Number(item.quantity);
    const unityPrice = Number(product.unityPrice);
    const totalPrice = quantity * unityPrice;

    subtotal += totalPrice;

    saleProducts.push({
      product: product._id,
      name: product.name,
      quantity,
      unityPrice,
      totalPrice,
    });
  }

  const saleDiscount = Number(discount || 0);
  const saleShipping = Number(shipping || 0);
  const total = subtotal - saleDiscount + saleShipping;

  const saleNumber = `SALE-${Date.now()}`;

  const newSale = await Sale.create({
    saleNumber,
    client: client || null,
    customerDocument: customerDocument || "",
    seller: reqUser._id,
    products: saleProducts,
    payment,
    subtotal,
    discount: saleDiscount,
    shipping: saleShipping,
    total,
    notes,
    status: "FINISHED",
  });

  if (!newSale) {
    res.status(422).json({
      errors: ["Houve um erro, tente novamente mais tarde."],
    });

    return;
  }

  for (const item of saleProducts) {
    const product = await Product.findById(item.product);

    product.stock -= item.quantity;
    product.totalPrice = Number(product.stock) * Number(product.unityPrice);

    await product.save();
  }

  const sale = await Sale.findById(newSale._id)
    .populate("client")
    .populate("seller")
    .populate("products.product");

  res.status(201).json(sale);
};

// Get all sales
const getAllSales = async (req, res) => {
  const reqUser = req.user;

  const sales = await Sale.find({
    seller: reqUser._id,
  })
    .sort([["createdAt", -1]])
    .populate("client")
    .populate("seller")
    .populate("products.product");

  res.status(200).json(sales);
};

// Get sale by id
const getSaleById = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const sale = await Sale.findById(new mongoose.Types.ObjectId(id))
      .populate("client")
      .populate("seller")
      .populate("products.product");

    if (!sale) {
      res.status(404).json({
        errors: ["Venda não encontrada."],
      });

      return;
    }

    if (sale.seller._id.toString() !== reqUser._id.toString()) {
      res.status(403).json({
        errors: ["Acesso negado."],
      });

      return;
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(404).json({
      errors: ["Venda não encontrada."],
    });
  }
};

// Update a sale
const updateSale = async (req, res) => {
  const { id } = req.params;

  // 🔒 SOMENTE ESTES CAMPOS PODEM SER ALTERADOS
  const { payment, notes, status } = req.body;

  const validSaleStatus = ["OPEN", "FINISHED", "CANCELLED"];

  const validPaymentStatus = ["PENDING", "PAID", "CANCELLED", "REFUNDED"];

  const validPaymentMethods = [
    "CASH",
    "PIX",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "BANK_SLIP",
    "TRANSFER",
  ];

  const reqUser = req.user;

  const sale = await Sale.findById(new mongoose.Types.ObjectId(id));

  if (!sale) {
    res.status(404).json({
      errors: ["Venda não encontrada."],
    });

    return;
  }

  if (sale.seller.toString() !== reqUser._id.toString()) {
    res.status(403).json({
      errors: ["Acesso negado."],
    });

    return;
  }

  // 🔒 NÃO DEIXA ALTERAR PRODUTOS DA VENDA
  if (req.body.products || req.body.client || req.body.total) {
    res.status(403).json({
      errors: [
        "Não é permitido alterar produtos, cliente ou valores da venda.",
      ],
    });

    return;
  }

  // STATUS DA VENDA
  if (status) {
    if (!validSaleStatus.includes(status)) {
      res.status(422).json({
        errors: ["Status da venda inválido."],
      });

      return;
    }

    sale.status = status;
  }

  // PAGAMENTO
  if (payment) {
    if (payment.method && !validPaymentMethods.includes(payment.method)) {
      res.status(422).json({
        errors: ["Método de pagamento inválido."],
      });

      return;
    }

    if (payment.status && !validPaymentStatus.includes(payment.status)) {
      res.status(422).json({
        errors: ["Status de pagamento inválido."],
      });

      return;
    }

    if (payment) {
      if (payment.method) {
        sale.payment.method = payment.method;
      }

      if (payment.status) {
        sale.payment.status = payment.status;
      }

      if (payment.installments !== undefined) {
        sale.payment.installments = Number(payment.installments);
      }

      sale.markModified("payment");
    }
  }

  // OBSERVAÇÕES
  if (notes !== undefined) {
    sale.notes = notes;
  }

  await sale.save();

  const updatedSale = await Sale.findById(sale._id)
    .populate("client")
    .populate("seller")
    .populate("products.product");

  res.status(200).json(updatedSale);
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
};
