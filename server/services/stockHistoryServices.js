const db = require("../../config/dbConfig");

const getStockHistory = async (filters) => {

    const {
        product_id,
        warehouse_id,
        transaction_type,
        start_date,
        end_date,
        page = 1,
        limit = 10
    } = filters;

    let query = `
        SELECT
            st.*,
            p.product_name,
            w.warehouse_name,
            u.full_name AS performed_by_name
        FROM stock_transactions st
        JOIN products p
            ON st.product_id = p.id
        JOIN warehouses w
            ON st.warehouse_id = w.id
        LEFT JOIN users u
            ON st.performed_by = u.id
        WHERE 1 = 1
    `;

    const values = [];

    if (product_id) {
        query += " AND st.product_id = ?";
        values.push(product_id);
    }

    if (warehouse_id) {
        query += " AND st.warehouse_id = ?";
        values.push(warehouse_id);
    }

    if (transaction_type) {
        query += " AND st.transaction_type = ?";
        values.push(transaction_type);
    }

    if (start_date) {
        query += " AND DATE(st.transaction_date) >= ?";
        values.push(start_date);
    }

    if (end_date) {
        query += " AND DATE(st.transaction_date) <= ?";
        values.push(end_date);
    }

    query += `
        ORDER BY st.transaction_date DESC
        LIMIT ? OFFSET ?
    `;

    values.push(Number(limit));
    values.push((page - 1) * Number(limit));

    const [rows] = await db.query(query, values);

    return rows;
};

const getProductHistory = async (productId) => {

    const [rows] = await db.query(
        `
        SELECT
            st.*,
            w.warehouse_name,
            u.full_name AS performed_by_name
        FROM stock_transactions st
        JOIN warehouses w
            ON st.warehouse_id = w.id
        LEFT JOIN users u
            ON st.performed_by = u.id
        WHERE st.product_id = ?
        ORDER BY st.transaction_date DESC
        `,
        [productId]
    );

    return rows;
};

const getWarehouseHistory = async (warehouseId) => {

    const [rows] = await db.query(
        `
        SELECT
            st.*,
            p.product_name,
            u.full_name AS performed_by_name
        FROM stock_transactions st
        JOIN products p
            ON st.product_id = p.id
        LEFT JOIN users u
            ON st.performed_by = u.id
        WHERE st.warehouse_id = ?
        ORDER BY st.transaction_date DESC
        `,
        [warehouseId]
    );

    return rows;
};

module.exports = {
    getStockHistory,
    getProductHistory,
    getWarehouseHistory
};