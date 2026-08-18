const ApiError = require("../utils/ApiError");

function validateCategory(req, res, next) {
  const { name, slug } = req.body;
  const errors = [];

  if (!name || !String(name).trim()) {
    errors.push("'name' is required.");
  }

  if (!slug || !String(slug).trim()) {
    errors.push("'slug' is required.");
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push("'slug' must contain only lowercase letters, numbers, and hyphens.");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join(" ")));
  }

  next();
}

module.exports = validateCategory;
