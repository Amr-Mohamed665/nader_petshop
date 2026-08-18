const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} = require("../controllers/categories.controller");
const validateCategory = require("../middleware/validateCategory");
const authenticate = require("../middleware/authenticate");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategory);

// Admin-only routes
router.post("/", authenticate, requireRole("admin"), validateCategory, createCategory);
router.put("/reorder", authenticate, requireRole("admin"), reorderCategories);
router.put("/:id", authenticate, requireRole("admin"), validateCategory, updateCategory);
router.delete("/:id", authenticate, requireRole("admin"), deleteCategory);

module.exports = router;
