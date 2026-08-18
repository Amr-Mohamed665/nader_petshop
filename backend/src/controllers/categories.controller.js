const categoriesStore = require("../data/categoriesStore");
const menuItemsStore = require("../data/menuItemsStore");
const ApiError = require("../utils/ApiError");

// GET /api/categories  (public)
function getCategories(req, res) {
  const categories = categoriesStore.getAll();
  res.status(200).json({ success: true, count: categories.length, data: categories });
}

// GET /api/categories/:id  (public)
function getCategory(req, res, next) {
  const category = categoriesStore.getById(req.params.id);
  if (!category) {
    return next(new ApiError(404, `Category with id '${req.params.id}' was not found.`));
  }
  res.status(200).json({ success: true, data: category });
}

// POST /api/categories  (admin only)
function createCategory(req, res, next) {
  // Check slug uniqueness
  const existing = categoriesStore.getBySlug(req.body.slug);
  if (existing) {
    return next(new ApiError(409, `A category with slug '${req.body.slug}' already exists.`));
  }

  const category = categoriesStore.create(req.body);
  res.status(201).json({ success: true, data: category });
}

// PUT /api/categories/:id  (admin only)
function updateCategory(req, res, next) {
  const updated = categoriesStore.update(req.params.id, req.body);
  if (!updated) {
    return next(new ApiError(404, `Category with id '${req.params.id}' was not found.`));
  }
  res.status(200).json({ success: true, data: updated });
}

// DELETE /api/categories/:id  (admin only)
// Cascade: also deletes all products (menu items) belonging to this category
function deleteCategory(req, res, next) {
  const category = categoriesStore.getById(req.params.id);
  if (!category) {
    return next(new ApiError(404, `Category with id '${req.params.id}' was not found.`));
  }

  // Delete all products in this category
  const allProducts = menuItemsStore.getAll();
  const productsInCategory = allProducts.filter(
    (p) => p.category && p.category.toLowerCase() === category.slug.toLowerCase()
  );

  let deletedProductsCount = 0;
  for (const product of productsInCategory) {
    menuItemsStore.remove(product.id);
    deletedProductsCount++;
  }

  // Delete the category itself
  categoriesStore.remove(req.params.id);

  res.status(200).json({
    success: true,
    message: `Category '${category.name}' and ${deletedProductsCount} product(s) deleted successfully.`,
    deletedProductsCount,
  });
}

// PUT /api/categories/reorder  (admin only)
function reorderCategories(req, res, next) {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return next(new ApiError(400, "'orderedIds' must be a non-empty array of category IDs."));
  }

  const categories = categoriesStore.reorder(orderedIds);
  res.status(200).json({ success: true, data: categories });
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
};
