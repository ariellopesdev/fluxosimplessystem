const express = require("express");
const router = express.Router();

// Controller
const {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
} = require("../controllers/SalesController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

// Validations
const {
  salesCreateValidation,
  salesUpdateValidation,
} = require("../middlewares/salesValidations");

router.post("/", authGuard, salesCreateValidation(), validate, createSale);

router.get("/", authGuard, getAllSales);

router.get("/:id", authGuard, getSaleById);

router.put("/:id", authGuard, salesUpdateValidation(), validate, updateSale);

module.exports = router;
