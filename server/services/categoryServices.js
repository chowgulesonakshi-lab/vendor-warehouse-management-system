let categories=[];

const getAllCategories = ()=> categories;

const getCategoryById = (id) => {
    return categories.find(c => c.id === Number(id));
};

const createCategory = (category)=> {
    const newCategory = {
        id: categories.length+1,
        ...category
    };
    categories.push(newCategory);
    return newCategory;
};

const updateCategory = (id, updateData) => {
    const category = categories.find(c => c.id === Number(id));
    if(!category){
        return null;
    };
    Object.assign(category, updateData);
    return category;
};

const deleteCategory = (id) => {
    const index = categories.findIndex(c => c.id === Number(id));
    if (index === -1) {
        return false;
    }
    categories.splice(index, 1);
    return true;
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};