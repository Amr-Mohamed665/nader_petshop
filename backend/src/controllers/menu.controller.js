const menuItemsStore = require("../data/menuItemsStore");
const ApiError = require("../utils/ApiError");

// GET /api/menu?search=&category=all=true  (public or admin depending on params)
function getMenu(req, res) {
  const { search, category, all } = req.query;
  const availableOnly = all !== "true";
  const items = menuItemsStore.getAll({ search, category, availableOnly });
  res.status(200).json({ success: true, count: items.length, data: items });
}

// GET /api/menu/:id  (public)
function getMenuItem(req, res, next) {
  const item = menuItemsStore.getById(req.params.id);
  if (!item) {
    return next(new ApiError(404, `Menu item with id '${req.params.id}' was not found.`));
  }
  res.status(200).json({ success: true, data: item });
}

// POST /api/menu  (admin only)
function createMenuItem(req, res) {
  const item = menuItemsStore.create(req.body);
  res.status(201).json({ success: true, data: item });
}

// PUT /api/menu/:id  (admin only)
function updateMenuItem(req, res, next) {
  const updated = menuItemsStore.update(req.params.id, req.body);
  if (!updated) {
    return next(new ApiError(404, `Menu item with id '${req.params.id}' was not found.`));
  }
  res.status(200).json({ success: true, data: updated });
}

// DELETE /api/menu/:id  (admin only)
function deleteMenuItem(req, res, next) {
  const deleted = menuItemsStore.remove(req.params.id);
  if (!deleted) {
    return next(new ApiError(404, `Menu item with id '${req.params.id}' was not found.`));
  }
  res.status(200).json({ success: true, message: "Menu item deleted successfully." });
}

module.exports = { getMenu, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem };
