const express = require("express");
const router = express.Router();

// Controller
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

// Validations
const {
  clientCreateValidation,
  clientUpdateValidation,
} = require("../middlewares/clientValidations");

router.post(
  "/",
  authGuard,
  clientCreateValidation(),
  validate,
  createClient,
);

router.get(
  "/",
  authGuard,
  getAllClients,
);

router.get(
  "/:id",
  authGuard,
  getClientById,
);

router.put(
  "/:id",
  authGuard,
  clientUpdateValidation(),
  validate,
  updateClient,
);

router.delete(
  "/:id",
  authGuard,
  deleteClient,
);

module.exports = router;