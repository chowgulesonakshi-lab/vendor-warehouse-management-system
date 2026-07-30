const db = require("../config/db");

const getAllCategories = async () => {
    const [rows] = await db.query("SELECT * FROM categories");
    return rows;
};

const getCategoryById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM categories WHERE id = ?",
        [id]
    );
    return rows[0] || null;
};

const createCategory = async (category) => {
    const [result] = await db.query(
        "INSERT INTO categories (name, description) VALUES (?, ?)",
        [
            category.name,
            category.description
        ]
    );
    return {
        id: result.insertId,
        ...category
    };
};

const updateCategory = async (id, updateData) => {
    const [result] = await db.query(
        `UPDATE categories
        SET name = ?, description = ?
        WHERE id = ?`,
        [
            updateData.name,
            updateData.description,
            id
        ]
    );
    if (result.affectedRows === 0) {
        return null;
    }
    return await getCategoryById(id);
};

const deleteCategory = async (id) => {
    const [result] = await db.query(
        "DELETE FROM categories WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};