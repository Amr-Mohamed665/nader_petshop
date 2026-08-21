'use client';

import { useState, useCallback } from 'react';
import {
  uploadFileToCloudinary,
  uploadUrlToCloudinary,
} from '@/services/cloudinary.service';
import { toastSuccess, toastError } from '@/utils/toast';

/**
 * Reusable hook for Cloudinary image uploads.
 * Handles file uploads and URL uploads, with loading/error/preview state.
 *
 * @returns {{
 *   uploading: boolean,
 *   preview: string | null,
 *   uploadFile: (file: File) => Promise<string | null>,
 *   uploadUrl: (url: string) => Promise<string | null>,
 *   setPreview: (url: string) => void,
 *   reset: () => void,
 * }}
 */
export default function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const uploadFile = useCallback(async (file) => {
    if (!file) return null;
    setUploading(true);
    try {
      const secureUrl = await uploadFileToCloudinary(file);
      setPreview(secureUrl);
      toastSuccess('Image uploaded successfully.');
      return secureUrl;
    } catch (err) {
      toastError(err, 'Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadUrl = useCallback(async (url) => {
    if (!url) return null;
    setUploading(true);
    try {
      const secureUrl = await uploadUrlToCloudinary(url);
      setPreview(secureUrl);
      toastSuccess('Image uploaded successfully.');
      return secureUrl;
    } catch (err) {
      toastError(err, 'Failed to upload image URL. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPreview(null);
  }, []);

  return { uploading, preview, uploadFile, uploadUrl, setPreview, reset };
}
