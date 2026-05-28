const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/products", require("./ProductRoutes"));
router.use("/api/clients", require("./ClientRoutes"));
router.use("/api/sales", require("./SalesRoutes"));
router.use("/api/financial", require("./FinancialRoutes"));
router.use("/api/appointments", require("./AppointmentRoutes"));
router.use("/api/services", require("./ServiceRoutes"));

// test route
router.get("/", (req, res) => {
  res.send("API Working!");
});

module.exports = router;

