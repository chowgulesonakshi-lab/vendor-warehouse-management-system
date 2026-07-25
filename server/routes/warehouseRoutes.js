const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const {
    createWarehouse,
    getAllWarehouses,
    getWarehouseById,
    updateWarehouse,
    deleteWarehouse
} = require("../controllers/warehouseController");

const router = express.Router();
router.use(authenticateToken);

router.post("/", createWarehouse);
router.get("/", getAllWarehouses);
router.get("/:id", getWarehouseById);
router.put("/:id", updateWarehouse);
router.delete("/:id", deleteWarehouse);

module.exports = router;