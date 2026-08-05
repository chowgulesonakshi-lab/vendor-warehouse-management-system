const db = require("../../config/dbConfig");

const addStock = async (stockData) => {
    const {
        product_id,
        warehouse_id,
        quantity,
        performed_by,
        remarks
    } = stockData;

    // Record stock transaction
    const [transaction] = await db.query(
        `INSERT INTO stock_transactions
        (
            product_id,
            warehouse_id,
            transaction_type,
            quantity,
            remarks,
            performed_by
        )
        VALUES (?, ?, 'Stock In', ?, ?, ?)`,
        [
            product_id,
            warehouse_id,
            quantity,
            remarks || null,
            performed_by
        ]
    );

    // Check inventory
    const [inventory] = await db.query(
        `SELECT *
         FROM inventory
         WHERE product_id = ?
         AND warehouse_id = ?`,
        [product_id, warehouse_id]
    );

    if (inventory.length > 0) {

        const newQuantity =
            inventory[0].quantity + quantity;

        await db.query(
            `UPDATE inventory
             SET
                quantity = ?,
                available_quantity = ?,
                last_updated = CURRENT_TIMESTAMP
             WHERE product_id = ?
             AND warehouse_id = ?`,
            [
                newQuantity,
                newQuantity - inventory[0].reserved_quantity,
                product_id,
                warehouse_id
            ]
        );

    } else {

        await db.query(
            `INSERT INTO inventory
            (
                product_id,
                warehouse_id,
                quantity,
                reserved_quantity,
                available_quantity
            )
            VALUES (?, ?, ?, 0, ?)`,
            [
                product_id,
                warehouse_id,
                quantity,
                quantity
            ]
        );
    }

    return {
        id: transaction.insertId,
        ...stockData
    };
};

const getAllStockTransactions = async () => {
    const [rows] = await db.query(
        "SELECT * FROM stock_transactions"
    );

    return rows;
};

const getStockTransactionById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM stock_transactions WHERE id = ?",
        [id]
    );

    return rows[0] || null;
};

const getInventory = async () => {
    const [rows] = await db.query(
        "SELECT * FROM inventory"
    );

    return rows;
};

module.exports = {
    addStock,
    getAllStockTransactions,
    getStockTransactionById,
    getInventory
};