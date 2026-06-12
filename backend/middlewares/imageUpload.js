const multer = require("multer");
const path = require("path");

// Destination to store image
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("products")) {
      folder = "products";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }

    cb(null, `uploads/${folder}/`);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, Date.now() + extension);
  },
});

const imageUpload = multer({
  storage: imageStorage,

  fileFilter(req, file, cb) {
    const allowedExtensions = /\.(jpeg|jpg|png|webp)$/i;
    const allowedMimeTypes = /^image\/(jpeg|jpg|png|webp)$/;

    const isValidExtension = allowedExtensions.test(file.originalname);
    const isValidMimeType = allowedMimeTypes.test(file.mimetype);

    if (!isValidExtension || !isValidMimeType) {
      return cb(
        new Error(
          "Por favor, envie apenas imagens nos formatos jpeg, jpg, png ou webp.",
        ),
      );
    }

    cb(null, true);
  },
});

module.exports = { imageUpload };