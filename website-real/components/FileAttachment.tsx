"use client"

import { useState, useCallback } from 'react';
import Image from 'next/image'
import { StorageManager, BucketName, UploadResult } from '@/lib/storage';

interface FileAttachmentProps {
  bucket: BucketName;
  onFilesUploaded?: (files: UploadResult[]) => void;
  onFilesRemoved?: (fileIndex: number) => void;
  maxFiles?: number;
  className?: string;
  userId?: string;
  existingFiles?: { name: string; url: string; size: number }[];
}

interface FilePreview {
  file: File;
  preview?: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  result?: UploadResult;
}

export default function FileAttachment({
  bucket,
  onFilesUploaded,
  onFilesRemoved,
  maxFiles = 5,
  className = '',
  userId,
  existingFiles = []
}: FileAttachmentProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Upload files to storage
  const uploadFiles = useCallback(async (filesToUpload: FilePreview[]) => {
    const uploadResults: UploadResult[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const filePreview = filesToUpload[i];
      
      // Update uploading status
      setFiles(prev => prev.map(f => 
        f.file === filePreview.file 
          ? { ...f, uploading: true } 
          : f
      ));

      try {
        const result = await StorageManager.uploadFile({
          bucket,
          file: filePreview.file,
          userId
        });

        uploadResults.push(result);

        // Update file status
        setFiles(prev => prev.map(f => 
          f.file === filePreview.file 
            ? { 
                ...f, 
                uploading: false, 
                uploaded: result.success,
                error: result.success ? undefined : result.error,
                result
              } 
            : f
        ));

      } catch (err) {
        console.error('Upload error:', err);
        setFiles(prev => prev.map(f => 
          f.file === filePreview.file 
            ? { 
                ...f, 
                uploading: false, 
                uploaded: false,
                error: 'Upload failed'
              } 
            : f
        ));
      }
    }

    // Notify parent component
    if (onFilesUploaded) {
      onFilesUploaded(uploadResults.filter(r => r.success));
    }
  }, [bucket, userId, onFilesUploaded]);

  // Handle file selection
  const handleFiles = useCallback(async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    const currentFileCount = files.length + existingFiles.length;
    
    if (currentFileCount + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Create previews for new files
    const newFilePreviews: FilePreview[] = [];
    
    for (const file of fileArray) {
      // Validate file first
      const validation = StorageManager.validateFile(file, bucket);
      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`);
        continue;
      }

      const filePreview: FilePreview = {
        file,
        uploading: false,
        uploaded: false
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        filePreview.preview = URL.createObjectURL(file);
      }

      newFilePreviews.push(filePreview);
    }

    setFiles(prev => [...prev, ...newFilePreviews]);

    // Start uploading files
    await uploadFiles(newFilePreviews);
  }, [bucket, files.length, existingFiles.length, maxFiles, uploadFiles]);

  // Remove file
  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    
    // Revoke object URL to prevent memory leaks
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    setFiles(prev => prev.filter((_, i) => i !== index));
    
    if (onFilesRemoved) {
      onFilesRemoved(index);
    }
  };

  // Remove existing file
  const removeExistingFile = (index: number) => {
    if (onFilesRemoved) {
      onFilesRemoved(index);
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // File input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalFiles = files.length + existingFiles.length;
  const canAddMore = totalFiles < maxFiles;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50/10'
              : 'border-white/30 hover:border-white/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            multiple
            onChange={handleInputChange}
            className="hidden"
            accept={bucket === 'products' ? 'image/*' : undefined}
          />
          
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <div className="text-white mb-2">
            <label htmlFor="file-input" className="cursor-pointer">
              <span className="text-blue-400 hover:text-blue-300">Click to upload</span>
              <span className="text-gray-400"> or drag and drop</span>
            </label>
          </div>
          
          <p className="text-sm text-gray-400">
            {bucket === 'products' ? 'Images only' : 'Images, PDFs, Documents'} up to{' '}
            {bucket === 'tickets' ? '10MB' : bucket === 'products' ? '5MB' : '2MB'}
          </p>
          
          <p className="text-xs text-gray-500 mt-1">
            {totalFiles}/{maxFiles} files selected
          </p>
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Existing Attachments</h4>
          {existingFiles.map((file, index) => (
            <div key={`existing-${index}`} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View
                </a>
                <button
                  onClick={() => removeExistingFile(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">New Attachments</h4>
          {files.map((filePreview, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                  {filePreview.preview ? (
                  <Image
                    src={filePreview.preview}
                    alt="Preview"
                    width={48}
                    height={48}
                    unoptimized
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-white">{filePreview.file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(filePreview.file.size)}</p>
                  
                  {filePreview.uploading && (
                    <div className="mt-1">
                      <div className="w-32 bg-gray-700 rounded-full h-1">
                        <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                  
                  {filePreview.error && (
                    <p className="text-xs text-red-400 mt-1">{filePreview.error}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {filePreview.uploading ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : filePreview.uploaded ? (
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : filePreview.error ? (
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : null}
                
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300"
                  disabled={filePreview.uploading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}