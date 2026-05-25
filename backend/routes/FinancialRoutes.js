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
const roleGuard = require("../middlewares/roleGuard");

// Validations
const {
  financialCreateValidation,
  financialUpdateValidation,
} = require("../middlewares/financialValidations");

// Routes
router.post(
  "/",
  authGuard,
  roleGuard("ADMIN", "SUPER_ADMIN"),
  financialCreateValidation(),
  validate,
  createFinancial,
);

router.get("/", authGuard, roleGuard("ADMIN", "SUPER_ADMIN"), getAllFinancials);

router.get(
  "/summary",
  authGuard,
  roleGuard("ADMIN", "SUPER_ADMIN"),
  getFinancialSummary,
);

router.get(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "SUPER_ADMIN"),
  getFinancialById,
);

router.put(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "SUPER_ADMIN"),
  financialUpdateValidation(),
  validate,
  updateFinancial,
);

router.delete(
  "/:id",
  authGuard,
  roleGuard("ADMIN", "SUPER_ADMIN"),
  deleteFinancial,
);

module.exports = router;
