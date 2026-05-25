const express = require("express");
const router = express.Router();

// Controller
const {
  createFinancial,
  getAllFinancials,
  getFinancialById,
  updateFinancial,
  deleteFinancial,
  getFinancialSummary,
} = require("../controllers/FinancialController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

// Validations
const {
  financialCreateValidation,
  financialUpdateValidation,
} = require("../middlewares/financialValidations");

// Routes
router.post(
  "/",
  authGuard,
  financialCreateValidation(),
  validate,
  createFinancial,
);

router.get("/", authGuard, getAllFinancials);

router.get("/summary", authGuard, getFinancialSummary);

router.get("/:id", authGuard, getFinancialById);

router.put(
  "/:id",
  authGuard,
  financialUpdateValidation(),
  validate,
  updateFinancial,
);

router.delete("/:id", authGuard, deleteFinancial);

module.exports = router;