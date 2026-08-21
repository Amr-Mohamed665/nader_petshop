# Pet Shop – Task List

## Backend
- [x] Modify `menuItemsStore.js` — add `featured` field to `create()` and `update()`
- [x] Modify `menuItems.json` — add `"featured": false` to all existing items
- [x] Modify `menu.controller.js` — remove hard-coded `availableOnly: true`

## Toast System
- [x] Install `react-toastify` (Added to `package.json`, user needs to run `npm install`)
- [x] Create `frontend/utils/toast.js` — centralized helpers
- [x] Modify `frontend/app/layout.js` — add `<ToastContainer>`

## Cloudinary
- [x] Add Cloudinary vars to `frontend/.env.local` & `frontend/.env.production`
- [x] Create `frontend/services/cloudinary.service.js`
- [x] Create `frontend/hooks/useCloudinaryUpload.js`
- [x] Create `frontend/components/molecules/ImageUploader.jsx`

## ProductForm & Validators
- [x] Modify `frontend/lib/validators.js` — add `featured` to `productSchema`
- [x] Modify `frontend/components/organisms/ProductForm.jsx` — add featured checkbox + ImageUploader

## Admin Pages
- [x] Modify `frontend/app/admin/products/new/page.js` — toasts
- [x] Modify `frontend/app/admin/products/[id]/edit/page.js` — featured field + toasts
- [x] Modify `frontend/app/admin/products/page.js` — remove DnD, add toasts

## Home Page
- [x] Modify `frontend/app/page.js` — filter `featured === true`

## Cart & Auth Toasts
- [x] Modify `frontend/context/CartContext.js` — toast on addItem
- [x] Find & modify auth pages — login/logout toasts
