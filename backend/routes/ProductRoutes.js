const express = require("express");
const router = express.Router();

// Controller
const {
  createProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");
const validate = require("../middlewares/handleValidation");

// Validations
const {
  productCreateValidation,
  productUpdateValidation,
} = require("../middlewares/productValidations");

// 🔹 ROTAS
router.post(
  "/",
  authGuard,
  imageUpload.single("productImage"),
  productCreateValidation(),
  validate,
  createProduct,
);

router.get("/", authGuard, getProduct);

router.get("/:id", authGuard, getProductById);

router.put(
  "/:id",
  authGuard,
  imageUpload.single("productImage"),
  productUpdateValidation(),
  validate,
  updateProduct,
);

router.delete("/:id", authGuard, deleteProduct);

module.exports = router;