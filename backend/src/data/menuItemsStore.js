const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "menuItems.json");

function readAll() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeAll(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

function getAll({ search, category, availableOnly } = {}) {
  let items = readAll();

  if (category) {
    items = items.filter((i) => i.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const term = String(search).toLowerCase();
    items = items.filter((i) => i.name.toLowerCase().includes(term));
  }
  if (availableOnly) {
    items = items.filter((i) => i.available !== false);
  }

  return items;
}

function getById(id) {
  return readAll().find((i) => i.id === String(id));
}

function create(data) {
  const items = readAll();

  const newItem = {
    id: Date.now().toString(),
    name: data.name,
    category: data.category || "Main Course",
    price: Number(data.price),
    description: data.description || "",
    image: data.image || "",
    available: data.available !== undefined ? Boolean(data.available) : true,
    createdAt: new Date().toISOString(),
  };

  items.push(newItem);
  writeAll(items);
  return newItem;
}

function update(id, data) {
  const items = readAll();
  const index = items.findIndex((i) => i.id === String(id));
  if (index === -1) return null;

  const existing = items[index];
  const updated = {
    ...existing,
    name: data.name ?? existing.name,
    category: data.category ?? existing.category,
    price: data.price !== undefined ? Number(data.price) : existing.price,
    description: data.description ?? existing.description,
    image: data.image ?? existing.image,
    available: data.available !== undefined ? Boolean(data.available) : existing.available,
  };

  items[index] = updated;
  writeAll(items);
  return updated;
}

function remove(id) {
  const items = readAll();
  const index = items.findIndex((i) => i.id === String(id));
  if (index === -1) return false;

  items.splice(index, 1);
  writeAll(items);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
