const db = require("../../config/dbConfig");

const getLowStockProducts = async () => {

    const [rows] = await db.query(
        `SELECT
            p.id AS product_id,
            p.product_name,
            p.sku,
            p.minimum_stock,
            i.quantity,
            i.available_quantity,
            w.id AS warehouse_id,
            w.warehouse_name
        FROM inventory i
        JOIN products p
            ON i.product_id = p.id
        JOIN warehouses w
            ON i.warehouse_id = w.id
        WHERE i.quantity <= p.minimum_stock
        ORDER BY
            (p.minimum_stock - i.quantity) DESC`
    );

    return rows;
};

const getLowStockByProduct = async (productId) => {

    const [rows] = await db.query(
        `SELECT
            p.id AS product_id,
            p.product_name,
            p.sku,
            p.minimum_stock,
            i.quantity,
            i.available_quantity,
            w.warehouse_name
        FROM inventory i
        JOIN products p
            ON i.product_id = p.id
        JOIN warehouses w
            ON i.warehouse_id = w.id
        WHERE
            p.id = ?
            AND i.quantity <= p.minimum_stock`,
        [productId]
    );

    return rows;
};

module.exports = {
    getLowStockProducts,
    getLowStockByProduct
};