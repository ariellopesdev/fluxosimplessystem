const express = require("express");
const router = express.Router();

// Controller
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");

// Middlewares
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

// 🔹 ROTAS
router.post("/", authGuard, imageUpload.single("image"), createProduct);
router.get("/", authGuard, getProducts);
router.get("/:id", authGuard, getProductById);
router.put("/:id", authGuard, imageUpload.single("image"), updateProduct);
router.delete("/:id", authGuard, deleteProduct);

module.exports = router;