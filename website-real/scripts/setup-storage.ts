import { initializeBuckets } from '../lib/storage';

async function setupStorage() {
  console.log('🚀 Initializing Supabase Storage Buckets...');
  
  try {
    const results = await initializeBuckets();
    
    console.log('\n📦 Bucket Creation Results:');
    console.log('═══════════════════════════');
    
    results.forEach(result => {
      const status = result.created ? '✅ Created' : result.error ? '❌ Failed' : '📁 Exists';
      console.log(`${status} - ${result.bucket}`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      } else if (result.message) {
        console.log(`   Note: ${result.message}`);
      }
    });
    
    console.log('\n🎉 Storage initialization complete!');
    
    // Print bucket configuration
    console.log('\n📋 Bucket Configuration:');
    console.log('═══════════════════════════');
    console.log('tickets  - Support ticket attachments (10MB max, images/docs)');
    console.log('products - Product images (5MB max, images only, public)');
    console.log('users    - User profile pictures (2MB max, images only)');
    console.log('orders   - Order receipts and documents (5MB max, images/PDFs)');
    console.log('general  - General file storage (20MB max, all types)');
    
  } catch (error) {
    console.error('❌ Failed to initialize storage:', error);
    process.exit(1);
  }
}

// Run the setup
setupStorage();