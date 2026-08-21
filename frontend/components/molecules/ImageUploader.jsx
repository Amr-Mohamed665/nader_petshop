'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Spinner from '@/components/atoms/Spinner';
import useCloudinaryUpload from '@/hooks/useCloudinaryUpload';
import { cn } from '@/utils/cn';

/**
 * Reusable image uploader with two modes:
 *  1. Pick or Drag & Drop a file from disk → upload to Cloudinary → return secure_url
 *  2. Paste an external URL → upload to Cloudinary → return secure_url
 *
 * Props:
 *  currentImageUrl  – The existing image URL (e.g. from edit form)
 *  onUpload(url)    – Called with the Cloudinary secure_url after upload
 *  className        – Optional wrapper class
 */
export default function ImageUploader({ currentImageUrl, onUpload, className }) {
  const fileRef = useRef(null);
  const [urlInput, setUrlInput] = useState('');
  const [tab, setTab] = useState('file'); // 'file' | 'url'
  const [isDragActive, setIsDragActive] = useState(false);

  const { uploading, preview, uploadFile, uploadUrl, setPreview } =
    useCloudinaryUpload();

  // Sync current image URL as preview when the form loads in edit mode
  useEffect(() => {
    if (currentImageUrl && !preview) {
      setPreview(currentImageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageUrl]);

  const processFile = async (file) => {
    if (!file) return;
    const secureUrl = await uploadFile(file);
    if (secureUrl) onUpload(secureUrl);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    await processFile(file);
    // Reset file input so the same file can be re-uploaded if needed
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (uploading) return;

    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processFile(file);
    }
  };

  const handleUrlUpload = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const secureUrl = await uploadUrl(trimmed);
    if (secureUrl) {
      onUpload(secureUrl);
      setUrlInput('');
    }
  };

  const displayImage = preview || currentImageUrl;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Tab switcher */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setTab('file')}
          className={cn(
            'px-3 py-1 text-xs font-bold rounded-md transition-all',
            tab === 'file'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <i className="fa-solid fa-upload mr-1.5" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={cn(
            'px-3 py-1 text-xs font-bold rounded-md transition-all',
            tab === 'url'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <i className="fa-solid fa-link mr-1.5" />
          Image URL
        </button>
      </div>

      {/* File upload / Drag & Drop area */}
      {tab === 'file' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 select-none text-center',
            isDragActive
              ? 'border-teal-500 bg-teal-50/40 scale-[0.99]'
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300',
            uploading && 'opacity-60 cursor-not-allowed pointer-events-none'
          )}
        >
          <input
            id="image-file-input"
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <Spinner size="md" />
          ) : (
            <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400" />
          )}
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-700">
              {uploading ? 'Uploading to Cloudinary...' : 'Drag & drop image here, or click to browse'}
            </p>
            <p className="text-[10px] text-slate-400">
              Supports: JPG, PNG, GIF, WebP (Max 10MB)
            </p>
          </div>
        </div>
      )}

      {/* URL upload */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={uploading}
            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleUrlUpload}
            disabled={uploading || !urlInput.trim()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? <Spinner size="xs" color="white" /> : null}
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      )}

      {/* Image preview */}
      {displayImage && (
        <div className="relative h-32 w-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm mt-2">
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <Spinner size="sm" />
            </div>
          )}
          <Image
            src={displayImage}
            alt="Product preview"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
