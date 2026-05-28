const express = require("express");
const router = express.Router();

// Controller
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/ServiceController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

// Validations
const {
  serviceCreateValidation,
  serviceUpdateValidation,
} = require("../middlewares/serviceValidations");

// Routes
router.post(
  "/",
  authGuard,
  serviceCreateValidation(),
  validate,
  createService,
);

router.get("/", authGuard, getAllServices);

router.get("/:id", authGuard, getServiceById);

router.put(
  "/:id",
  authGuard,
  serviceUpdateValidation(),
  validate,
  updateService,
);

router.delete("/:id", authGuard, deleteService);

module.exports = router;