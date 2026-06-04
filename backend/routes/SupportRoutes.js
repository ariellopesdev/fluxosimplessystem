const express = require("express");
const router = express.Router();

// Controller
const {
  createSupportTicket,
  getMySupportTickets,
  getAllSupportTickets,
  getSupportTicketById,
  addSupportMessage,
  updateSupportStatus,
} = require("../controllers/SupportController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const roleGuard = require("../middlewares/roleGuard");

// Validations
const {
  supportCreateValidation,
  supportMessageValidation,
  supportStatusValidation,
  supportFilterValidation,
} = require("../middlewares/supportValidations");

// Routes
router.post(
  "/",
  authGuard,
  supportCreateValidation(),
  validate,
  createSupportTicket,
);

router.get("/my", authGuard, getMySupportTickets);

router.get(
  "/",
  authGuard,
  roleGuard("ADMIN", "SUPER_ADMIN"),
  supportFilterValidation(),
  validate,
  getAllSupportTickets,
);

router.get("/:id", authGuard, getSupportTicketById);

router.post(
  "/:id/messages",
  authGuard,
  supportMessageValidation(),
  validate,
  addSupportMessage,
);

router.patch(
  "/:id/status",
  authGuard,
  roleGuard("ADMIN", "SUPER_ADMIN"),
  supportStatusValidation(),
  validate,
  updateSupportStatus,
);

module.exports = router;
