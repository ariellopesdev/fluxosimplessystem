const express = require("express");
const router = express.Router();

// Controller
const {
  getReports,
  getReportById,
  generateReport,
  deleteReport,
} = require("../controllers/ReportsController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

// Validations
const {
  reportGenerateValidation,
} = require("../middlewares/reportsValidations");

router.get("/", authGuard, getReports);

router.get("/:id", authGuard, getReportById);

router.post(
  "/generate",
  authGuard,
  reportGenerateValidation(),
  validate,
  generateReport,
);

router.delete("/:id", authGuard, deleteReport);

module.exports = router;