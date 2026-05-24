const express = require("express");
const router = express.Router();

// Controller
const {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
} = require("../controllers/salesController");

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

router.delete("/:id", authGuard, deleteSale);

module.exports = router;
