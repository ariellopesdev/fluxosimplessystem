const express = require("express");
const router = express.Router();

// Controller
const {
  getDashboard,
  getLatestDashboard,
  deleteDashboard,
} = require("../controllers/DashboardController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

// Validations
const {
  dashboardFilterValidation,
} = require("../middlewares/dashboardValidations");

// Routes
router.get("/", authGuard, dashboardFilterValidation(), validate, getDashboard);

router.get("/latest", authGuard, getLatestDashboard);

router.delete("/:id", authGuard, deleteDashboard);

module.exports = router;