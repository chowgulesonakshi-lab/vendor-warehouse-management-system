const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const stockInRoutes = require("./routes/stockInRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const stockHistoryRoutes = require("./routes/stockHistoryRoutes");
const lowStockRoutes = require("./routes/lowStockRoutes");
const searchRoutes = require("./routes/searchRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const dispatchOrderRoutes = require("./routes/dispatchOrderRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stock-in", stockInRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/stock-history", stockHistoryRoutes);
app.use("/api/low-stock", lowStockRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/dispatch-orders", dispatchOrderRoutes);

module.exports = app;