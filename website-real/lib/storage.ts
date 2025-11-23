import { supabase } from '../app/supabase-client';

// Storage bucket configuration
export const STORAGE_BUCKETS = {
  TICKETS: 'tickets',
  PRODUCTS: 'products',
  USERS: 'users',
  ORDERS: 'orders',
  GENERAL: 'general'
} as const;

export type BucketName = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

// File type configurations for each bucket
export const BUCKET_CONFIG: Record<BucketName, {
  maxFileSize: number;
  allowedTypes: readonly string[];
  allowedExtensions: readonly string[];
  description: string;
}> = {
  tickets: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
    description: 'Support ticket attachments'
  },
  products: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/*'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    description: 'Product images and media'
  },
  users: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/*'],
    allowedExtensions: ['.jpg', '.jpeg', '.png'],
    description: 'User profile pictures and documents'
  },
  orders: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/*', 'application/pdf'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf'],
    description: 'Order receipts and related documents'
  },
  general: {
    maxFileSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['*'],
    allowedExtensions: [],
    description: 'General file storage'
  }
} as const;

// File upload utility
export interface UploadOptions {
  bucket: BucketName;
  file: File;
  path?: string;
  userId?: string;
  replace?: boolean;
}

export interface UploadResult {
  success: boolean;
  data?: {
    path: string;
    fullPath: string;
    publicUrl: string;
    size: number;
    type: string;
  };
  error?: string;
}

export class StorageManager {

  // Validate file before upload
  static validateFile(file: File, bucket: BucketName): { valid: boolean; error?: string } {
    const config = BUCKET_CONFIG[bucket];

    // Check file size
    if (file.size > config.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds ${config.maxFileSize / (1024 * 1024)}MB limit`
      };
    }

    // Check file type if not wildcard
    if (config.allowedTypes[0] !== '*') {
      const isValidType = config.allowedTypes.some((type: string) => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'));
        }
        return file.type === type;
      });

      if (!isValidType && config.allowedExtensions.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isValidExtension = config.allowedExtensions.includes(fileExtension);

        if (!isValidExtension) {
          return {
            valid: false,
            error: `File type not allowed. Accepted types: ${config.allowedExtensions.join(', ')}`
          };
        }
      } else if (!isValidType) {
        return {
          valid: false,
          error: `File type not allowed`
        };
      }
    }

    return { valid: true };
  }

  // Generate unique file path
  static generateFilePath(bucket: BucketName, fileName: string, userId?: string, customPath?: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = fileName.split('.').pop();
    const baseName = fileName.split('.').slice(0, -1).join('.');
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');

    if (customPath) {
      return `${customPath}/${timestamp}_${randomId}_${sanitizedBaseName}.${extension}`;
    }

    switch (bucket) {
      case 'tickets':
        return `tickets/${userId || 'anonymous'}/${timestamp}_${randomId}_${sanitizedBaseName}.${extension}`;
      case 'products':
        return `products/${timestamp}_${randomId}_${sanitizedBaseName}.${extension}`;
      case 'users':
        return `profiles/${userId}/${timestamp}_${randomId}_${sanitizedBaseName}.${extension}`;
      case 'orders':
        return `orders/${userId}/${timestamp}_${randomId}_${sanitizedBaseName}.${extension}`;
      case 'general':
        return `general/${timestamp}_${randomId}_${sanitizedBaseName}.${extension}`;
      default:
        return `${timestamp}_${randomId}_${sanitizedBaseName}.${extension}`;
    }
  }

  // Upload file to storage
  static async uploadFile(options: UploadOptions): Promise<UploadResult> {
    try {
      const { bucket, file, path, userId, replace = false } = options;

      // Validate file
      const validation = this.validateFile(file, bucket);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate file path
      const filePath = path || this.generateFilePath(bucket, file.name, userId);

      // Check if bucket exists, create if not
      // const { data: buckets } = await supabase.storage.listBuckets();
      // const bucketExists = buckets?.some(b => b.name === bucket);

      // if (!bucketExists) {
      //   const { error: createError } = await supabase.storage.createBucket(bucket, {
      //     public: bucket === 'products', // Make product images public
      //     allowedMimeTypes: [...BUCKET_CONFIG[bucket].allowedTypes],
      //     fileSizeLimit: BUCKET_CONFIG[bucket].maxFileSize
      //   });

      //   if (createError) {
      //     return { success: false, error: `Failed to create bucket: ${createError.message}` };
      //   }
      // }

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: replace
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        success: true,
        data: {
          path: data.path,
          fullPath: `${bucket}/${data.path}`,
          publicUrl: urlData.publicUrl,
          size: file.size,
          type: file.type
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Upload multiple files
  static async uploadMultipleFiles(files: UploadOptions[]): Promise<UploadResult[]> {
    const results = await Promise.allSettled(
      files.map(options => this.uploadFile(options))
    );

    return results.map(result =>
      result.status === 'fulfilled'
        ? result.value
        : { success: false, error: 'Upload failed' }
    );
  }

  // Delete file from storage
  static async deleteFile(bucket: BucketName, path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }

  // List files in bucket
  static async listFiles(bucket: BucketName, path?: string, limit?: number) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, {
          limit: limit || 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, files: data };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'List failed'
      };
    }
  }

  // Get file info
  static async getFileInfo(bucket: BucketName, path: string) {
    try {
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      // Get file metadata (if available)
      const { data: files } = await supabase.storage
        .from(bucket)
        .list(path.split('/').slice(0, -1).join('/'));

      const fileName = path.split('/').pop();
      const fileInfo = files?.find(f => f.name === fileName);

      return {
        success: true,
        data: {
          publicUrl: urlData.publicUrl,
          metadata: fileInfo
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Get info failed'
      };
    }
  }

  // Download file
  static async downloadFile(bucket: BucketName, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed'
      };
    }
  }
}

// Utility functions for common operations
export const uploadTicketAttachment = (file: File, userId?: string) =>
  StorageManager.uploadFile({ bucket: 'tickets', file, userId });

export const uploadProductImage = (file: File, productId?: string) =>
  StorageManager.uploadFile({
    bucket: 'products',
    file,
    path: productId ? `products/${productId}` : undefined
  });

export const uploadUserProfilePicture = (file: File, userId: string) =>
  StorageManager.uploadFile({ bucket: 'users', file, userId });

export const uploadOrderDocument = (file: File, userId: string, orderId?: string) =>
  StorageManager.uploadFile({
    bucket: 'orders',
    file,
    userId,
    path: orderId ? `orders/${orderId}` : undefined
  });

// Create buckets script (run once during setup)
export const initializeBuckets = async () => {
  const results = [];

  for (const bucketName of Object.values(STORAGE_BUCKETS)) {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some(b => b.name === bucketName);

      if (!exists) {
        const config = BUCKET_CONFIG[bucketName as BucketName];
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: bucketName === 'products', // Make products public
          allowedMimeTypes: [...config.allowedTypes],
          fileSizeLimit: config.maxFileSize
        });

        results.push({
          bucket: bucketName,
          created: !error,
          error: error?.message
        });
      } else {
        results.push({
          bucket: bucketName,
          created: false,
          message: 'Already exists'
        });
      }
    } catch (error) {
      results.push({
        bucket: bucketName,
        created: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
};