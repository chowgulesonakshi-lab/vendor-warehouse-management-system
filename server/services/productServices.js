const db = require("../config/db");

const getAllProducts = async () => {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
};

const getProductById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM products WHERE id = ?",
        [id]
    );
    return rows[0] || null;
};

const createProduct = async (product) => {
    const [result] = await db.query(
        `INSERT INTO products
        (name, description, price, stock, category_id)
        VALUES (?, ?, ?, ?, ?)`,
        [
            product.name,
            product.description,
            product.price,
            product.stock,
            product.category_id
        ]
    );

    return {
        id: result.insertId,
        ...product
    };
};

const updateProduct = async (id, updateData) => {
    const [result] = await db.query(
        `UPDATE products
        SET
            name = ?,
            description = ?,
            price = ?,
            stock = ?,
            category_id = ?
        WHERE id = ?`,
        [
            updateData.name,
            updateData.description,
            updateData.price,
            updateData.stock,
            updateData.category_id,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await getProductById(id);
};

const deleteProduct = async (id) => {
    const [result] = await db.query(
        "DELETE FROM products WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};