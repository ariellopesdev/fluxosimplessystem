require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();

// Trust proxy for Render/Vercel requests
app.set("trust proxy", 1);

// config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PROD_URL,
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origem não permitida pelo CORS."));
    },
  }),
);

// upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// DB conection
require("./config/db.js");

// routes
const router = require("./routes/Router.js");

app.use(router);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
