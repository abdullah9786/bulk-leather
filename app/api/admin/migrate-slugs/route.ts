import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { withAdminAuth } from "@/lib/middleware";

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// POST - Migrate all products without slugs (admin only)
export const POST = withAdminAuth(async (req: NextRequest) => {
  try {
    await connectDB();

    // Find all products without slugs
    const productsWithoutSlugs = await Product.find({ 
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" }
      ]
    });

    console.log(`📦 Found ${productsWithoutSlugs.length} products without slugs`);

    if (productsWithoutSlugs.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All products already have slugs!",
        updated: 0,
        total: 0
      });
    }

    let updated = 0;
    let errors = 0;
    const errorDetails: any[] = [];

    for (const product of productsWithoutSlugs) {
      try {
        let slug = generateSlug(product.name);
        
        console.log(`🔄 Processing: "${product.name}" (ID: ${product._id})`);
        console.log(`   Generated slug: "${slug}"`);
        
        // Check for duplicate slugs
        let existingProduct = await Product.findOne({ 
          slug, 
          _id: { $ne: product._id } 
        });
        
        // If slug exists, add timestamp suffix
        if (existingProduct) {
          const timestamp = Date.now();
          slug = `${slug}-${timestamp}`;
          console.log(`⚠️  Slug "${generateSlug(product.name)}" already exists, using "${slug}"`);
        }
        
        // Use $set to explicitly update the slug field
        const updateResult = await Product.findByIdAndUpdate(
          product._id, 
          { $set: { slug } },
          { new: true, runValidators: true }
        );
        
        if (updateResult && updateResult.slug) {
          console.log(`✅ Updated "${product.name}" → "${updateResult.slug}"`);
          updated++;
        } else {
          console.error(`❌ Update failed for "${product.name}" - no slug in result`);
          errors++;
          errorDetails.push({
            productName: product.name,
            productId: product._id,
            error: "Slug not saved in database"
          });
        }
      } catch (error: any) {
        console.error(`❌ Error updating "${product.name}":`, error.message);
        console.error(`   Stack: ${error.stack}`);
        errors++;
        errorDetails.push({
          productName: product.name,
          productId: product._id,
          error: error.message
        });
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successfully updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);

    return NextResponse.json({
      success: true,
      message: `Migration completed! Updated ${updated} products${errors > 0 ? ` with ${errors} errors` : ''}.`,
      updated,
      errors,
      total: productsWithoutSlugs.length,
      errorDetails: errors > 0 ? errorDetails : undefined
    });

  } catch (error: any) {
    console.error("💥 Migration error:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      { 
        success: false,
        error: "Migration failed", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
});

// Also expose a GET endpoint to check migration status
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const totalProducts = await Product.countDocuments({});
    const productsWithSlugs = await Product.countDocuments({ 
      slug: { $exists: true, $nin: [null, ""] } 
    } as any);
    const productsWithoutSlugs = await Product.countDocuments({ 
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: "" }
      ]
    });
    
    return NextResponse.json({
      success: true,
      stats: {
        total: totalProducts,
        withSlugs: productsWithSlugs,
        withoutSlugs: productsWithoutSlugs,
        needsMigration: productsWithoutSlugs > 0
      }
    });
  } catch (error: any) {
    console.error("Error checking migration status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

