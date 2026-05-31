const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/products", require("./ProductRoutes"));
router.use("/api/clients", require("./ClientRoutes"));
router.use("/api/sales", require("./SalesRoutes"));
router.use("/api/financials", require("./FinancialRoutes"));
router.use("/api/appointments", require("./AppointmentRoutes"));
router.use("/api/services", require("./ServiceRoutes"));
router.use("/api/reports", require("./ReportsRoutes"));
router.use("/api/dashboard", require("./DashboardRoutes"));

// test route
router.get("/", (req, res) => {
  res.send("API Working!");
});

module.exports = router;
