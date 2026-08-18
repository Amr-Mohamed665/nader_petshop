const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "categories.json");

function readAll() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeAll(categories) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(categories, null, 2), "utf-8");
}

function getAll() {
  return readAll().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function getById(id) {
  return readAll().find((c) => c.id === String(id));
}

function getBySlug(slug) {
  return readAll().find(
    (c) => c.slug.toLowerCase() === String(slug).toLowerCase()
  );
}

function create(data) {
  const categories = readAll();
  const maxOrder = categories.reduce((max, c) => Math.max(max, c.order ?? 0), -1);

  const newCategory = {
    id: Date.now().toString(),
    name: data.name,
    slug: data.slug,
    description: data.description || "",
    image: data.image || "",
    order: maxOrder + 1,
  };

  categories.push(newCategory);
  writeAll(categories);
  return newCategory;
}

function update(id, data) {
  const categories = readAll();
  const index = categories.findIndex((c) => c.id === String(id));
  if (index === -1) return null;

  const existing = categories[index];
  const updated = {
    ...existing,
    name: data.name ?? existing.name,
    slug: data.slug ?? existing.slug,
    description: data.description ?? existing.description,
    image: data.image ?? existing.image,
  };

  categories[index] = updated;
  writeAll(categories);
  return updated;
}

function remove(id) {
  const categories = readAll();
  const index = categories.findIndex((c) => c.id === String(id));
  if (index === -1) return null;

  const removed = categories[index];
  categories.splice(index, 1);
  writeAll(categories);
  return removed;
}

function reorder(orderedIds) {
  const categories = readAll();

  orderedIds.forEach((id, idx) => {
    const cat = categories.find((c) => c.id === String(id));
    if (cat) {
      cat.order = idx;
    }
  });

  writeAll(categories);
  return categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

module.exports = { getAll, getById, getBySlug, create, update, remove, reorder };
