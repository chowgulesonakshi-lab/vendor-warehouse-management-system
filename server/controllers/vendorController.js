const vendorService = require("../services/vendorServices");

const createVendor = async (req, res) => {
    try {
        const vendor = await vendorService.createVendor(req.body);

        res.status(201).json({
            success: true,
            data: vendor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllVendors = async (req, res) => {
    try {
        const vendors = await vendorService.getAllVendors();

        res.json({
            success: true,
            data: vendors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getVendorById = async (req, res) => {
    try {
        const vendor = await vendorService.getVendorById(req.params.id);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.json({
            success: true,
            data: vendor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateVendor = async (req, res) => {
    try {
        const vendor = await vendorService.updateVendor(
            req.params.id,
            req.body
        );

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.json({
            success: true,
            data: vendor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteVendor = async (req, res) => {
    try {
        const deleted = await vendorService.deleteVendor(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.json({
            success: true,
            message: "Vendor deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor
};