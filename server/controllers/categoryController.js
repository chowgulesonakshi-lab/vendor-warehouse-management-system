const categoryService = require("../services/categoryServices");

const createCategory = (req, res) =>{
    const category = categoryService.createCategory(req.body);
    res.status(201).json({
        success: true,
        data: category
    });
};

const getAllCategories = (req, res) => {
    res.json({
        success: true,
        data: categoryService.getAllCategories()
    });
};

const getCategoryById = (req, res) => {
    const category = categoryService.getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }
    res.json({
        success: true,
        data: category
    });
};

const updateCategory = (req, res) => {
    const category = categoryService.updateCategory(
        req.params.id,
        req.body
    );
    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }
    res.json({
        success: true,
        data: category
    });
};

const deleteCategory = (req, res) => {
    const deleted = categoryService.deleteCategory(req.params.id);
    if (!deleted) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }
    res.json({
        success: true,
        message: "Category deleted successfully."
    });
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};