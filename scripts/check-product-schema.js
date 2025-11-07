/**
 * Script to check and fix Product schema issues
 * Run this to diagnose slug field problems
 */

const mongoose = require('mongoose');

async function checkSchema() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bulk-leather';
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // 1. Check if products exist
    const totalProducts = await productsCollection.countDocuments({});
    console.log(`📦 Total products: ${totalProducts}`);

    // 2. Check products with slugs
    const withSlug = await productsCollection.countDocuments({ slug: { $exists: true, $ne: null, $ne: "" } });
    console.log(`✅ Products WITH slugs: ${withSlug}`);

    // 3. Check products without slugs
    const withoutSlug = await productsCollection.countDocuments({ 
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" }
      ]
    });
    console.log(`❌ Products WITHOUT slugs: ${withoutSlug}\n`);

    // 4. Show sample products
    console.log('📋 Sample products (first 3):');
    const samples = await productsCollection.find({}).limit(3).toArray();
    samples.forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.name}`);
      console.log(`   ID: ${p._id}`);
      console.log(`   Slug: ${p.slug || '❌ NO SLUG'}`);
    });

    // 5. Check indexes
    console.log('\n📊 Current indexes:');
    const indexes = await productsCollection.indexes();
    indexes.forEach(idx => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
      if (idx.unique) console.log(`     (unique: ${idx.unique}, sparse: ${idx.sparse || false})`);
    });

    // 6. Try to add slug to one product manually
    if (withoutSlug > 0) {
      console.log('\n🧪 Testing manual slug update on first product without slug...');
      const testProduct = await productsCollection.findOne({ 
        $or: [
          { slug: { $exists: false } },
          { slug: null },
          { slug: "" }
        ]
      });

      if (testProduct) {
        const testSlug = testProduct.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        console.log(`   Product: "${testProduct.name}"`);
        console.log(`   Generated slug: "${testSlug}"`);

        try {
          const result = await productsCollection.updateOne(
            { _id: testProduct._id },
            { $set: { slug: testSlug } }
          );

          console.log(`   Update result:`, result);

          // Verify
          const updated = await productsCollection.findOne({ _id: testProduct._id });
          console.log(`   Verified slug: ${updated.slug || '❌ STILL NO SLUG'}`);
          
          if (updated.slug) {
            console.log('   ✅ Manual update SUCCESSFUL!');
          } else {
            console.log('   ❌ Manual update FAILED - slug not saved');
          }
        } catch (error) {
          console.error('   ❌ Error during update:', error.message);
        }
      }
    }

    console.log('\n✅ Schema check complete!');

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkSchema();

