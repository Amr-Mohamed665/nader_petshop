/**
 * Cloudinary upload service.
 * Uses unsigned uploads — no API Secret is exposed in the frontend.
 * Config is read from environment variables:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

function getUploadUrl() {
  if (!CLOUD_NAME) throw new Error('Cloudinary cloud name is not configured.');
  return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
}

/**
 * Upload a local File object to Cloudinary.
 * @param {File} file
 * @returns {Promise<string>} The secure_url of the uploaded image
 */
export async function uploadFileToCloudinary(file) {
  const url = getUploadUrl();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to upload image to Cloudinary.');
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Upload a remote image URL to Cloudinary (fetch-and-re-upload).
 * @param {string} imageUrl
 * @returns {Promise<string>} The secure_url of the uploaded image
 */
export async function uploadUrlToCloudinary(imageUrl) {
  const url = getUploadUrl();
  const formData = new FormData();
  formData.append('file', imageUrl);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to upload image URL to Cloudinary.');
  }

  const data = await response.json();
  return data.secure_url;
}
