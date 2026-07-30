const db = require("../config/db");

const getAllWarehouses = async () => {
    const [rows] = await db.query("SELECT * FROM warehouses");
    return rows;
};

const getWarehouseById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM warehouses WHERE id = ?",
        [id]
    );

    return rows[0] || null;
};

const createWarehouse = async (warehouse) => {
    const [result] = await db.query(
        `INSERT INTO warehouses
        (name, location, capacity)
        VALUES (?, ?, ?)`,
        [
            warehouse.name,
            warehouse.location,
            warehouse.capacity
        ]
    );

    return {
        id: result.insertId,
        ...warehouse
    };
};

const updateWarehouse = async (id, updatedData) => {
    const [result] = await db.query(
        `UPDATE warehouses
        SET name = ?, location = ?, capacity = ?
        WHERE id = ?`,
        [
            updatedData.name,
            updatedData.location,
            updatedData.capacity,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await getWarehouseById(id);
};

const deleteWarehouse = async (id) => {
    const [result] = await db.query(
        "DELETE FROM warehouses WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
};

module.exports = {
    getAllWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
};