const db = require("../config/db");

const addStock = async (stockData) => {
    const { productId, warehouseId, quantity } = stockData;

    const [result] = await db.query(
        `INSERT INTO stock_in
        (productId, warehouseId, quantity, date)
        VALUES (?, ?, ?, NOW())`,
        [productId, warehouseId, quantity]
    );

    const [inventory] = await db.query(
        "SELECT * FROM inventory WHERE productId = ? AND warehouseId = ?",
        [productId, warehouseId]
    );

    if (inventory.length > 0) {
        await db.query(
            `UPDATE inventory
             SET quantity = quantity + ?
             WHERE productId = ? AND warehouseId = ?`,
            [quantity, productId, warehouseId]
        );
    } else {
        await db.query(
            `INSERT INTO inventory
            (productId, warehouseId, quantity)
            VALUES (?, ?, ?)`,
            [productId, warehouseId, quantity]
        );
    }

    return {
        id: result.insertId,
        date: new Date(),
        ...stockData
    };
};

const getAllStockEntries = async () => {
    const [rows] = await db.query("SELECT * FROM stock_in");
    return rows;
};

const getStockEntryById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM stock_in WHERE id = ?",
        [id]
    );

    return rows[0] || null;
};

const getInventory = async () => {
    const [rows] = await db.query("SELECT * FROM inventory");
    return rows;
};

module.exports = {
    addStock,
    getAllStockEntries,
    getStockEntryById,
    getInventory
};