const express = require("express");
const router = express.Router();

// Controller
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentSummary,
} = require("../controllers/AppointmentController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

// Validations
const {
  appointmentCreateValidation,
  appointmentUpdateValidation,
} = require("../middlewares/appointmentValidations");

// Routes
router.post(
  "/",
  authGuard,
  appointmentCreateValidation(),
  validate,
  createAppointment,
);

router.get("/", authGuard, getAllAppointments);

router.get("/summary", authGuard, getAppointmentSummary);

router.get("/:id", authGuard, getAppointmentById);

router.put(
  "/:id",
  authGuard,
  appointmentUpdateValidation(),
  validate,
  updateAppointment,
);

router.delete("/:id", authGuard, deleteAppointment);

module.exports = router;