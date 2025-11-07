/**
 * Migration Script: Add Slugs to Existing Products
 * 
 * This script generates slugs for all existing products that don't have one.
 * Run this once after implementing the slug feature.
 * 
 * Usage:
 *   node scripts/migrate-product-slugs.js
 */

const mongoose = require('mongoose');
const readline = require('readline');

// Generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

async function migrateProducts() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bulk-leather';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get the Product model
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    // Find all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products\n`);

    if (products.length === 0) {
      console.log('ℹ️  No products to migrate');
      await mongoose.disconnect();
      return;
    }

    // Track products that need updating
    const productsToUpdate = products.filter(p => !p.slug);
    
    if (productsToUpdate.length === 0) {
      console.log('✅ All products already have slugs!');
      await mongoose.disconnect();
      return;
    }

    console.log(`🔄 ${productsToUpdate.length} products need slugs\n`);
    console.log('Products to update:');
    productsToUpdate.forEach((p, i) => {
      const slug = generateSlug(p.name);
      console.log(`  ${i + 1}. "${p.name}" → "${slug}"`);
    });

    // Ask for confirmation
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question('\n⚠️  Proceed with migration? (yes/no): ', resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
      console.log('\n❌ Migration cancelled');
      await mongoose.disconnect();
      return;
    }

    // Perform migration
    console.log('\n🚀 Starting migration...\n');
    let updated = 0;
    let errors = 0;

    for (const product of productsToUpdate) {
      try {
        const slug = generateSlug(product.name);
        
        // Check for duplicate slugs
        const existingProduct = await Product.findOne({ slug, _id: { $ne: product._id } });
        if (existingProduct) {
          console.log(`⚠️  Slug "${slug}" already exists, adding suffix...`);
          const timestamp = Date.now();
          const uniqueSlug = `${slug}-${timestamp}`;
          await Product.findByIdAndUpdate(product._id, { slug: uniqueSlug });
          console.log(`   ✓ Updated "${product.name}" → "${uniqueSlug}"`);
        } else {
          await Product.findByIdAndUpdate(product._id, { slug });
          console.log(`✓ Updated "${product.name}" → "${slug}"`);
        }
        
        updated++;
      } catch (error) {
        console.error(`✗ Error updating "${product.name}":`, error.message);
        errors++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successfully updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total processed: ${productsToUpdate.length}`);

    // Create indexes
    console.log('\n🔍 Creating indexes...');
    await Product.collection.createIndex({ slug: 1 }, { unique: true });
    await Product.collection.createIndex({ category: 1, isActive: 1 });
    console.log('✅ Indexes created');

    console.log('\n✨ Migration completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run migration
migrateProducts();

