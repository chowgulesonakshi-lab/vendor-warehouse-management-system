const db = require("../config/db");

const getAllVendors = async () => {
    const [rows] = await db.query("SELECT * FROM vendors");
    return rows;
};

const getVendorById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM vendors WHERE id = ?",
        [id]
    );

    return rows[0] || null;
};

const createVendor = async (vendor) => {
    const [result] = await db.query(
        `INSERT INTO vendors
        (vendorName, contactPerson, email, phone, address, gstNumber, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            vendor.vendorName,
            vendor.contactPerson,
            vendor.email,
            vendor.phone,
            vendor.address,
            vendor.gstNumber,
            vendor.status
        ]
    );

    return {
        id: result.insertId,
        ...vendor
    };
};

const updateVendor = async (id, updateData) => {
    const [result] = await db.query(
        `UPDATE vendors
        SET vendorName = ?, contactPerson = ?, email = ?, phone = ?, address = ?, gstNumber = ?, status = ?
        WHERE id = ?`,
        [
            updateData.vendorName,
            updateData.contactPerson,
            updateData.email,
            updateData.phone,
            updateData.address,
            updateData.gstNumber,
            updateData.status,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await getVendorById(id);
};

const deleteVendor = async (id) => {
    const [result] = await db.query(
        "DELETE FROM vendors WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;
};

module.exports = {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
};