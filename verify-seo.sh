#!/bin/bash

echo "🔍 SEO Metadata Verification Script"
echo "===================================="
echo ""

# Check if NEXT_PUBLIC_BASE_URL is set
if [ -z "$NEXT_PUBLIC_BASE_URL" ]; then
    echo "⚠️  WARNING: NEXT_PUBLIC_BASE_URL is not set!"
    echo "   Set it in your .env.local file or Vercel environment variables"
    echo "   Example: NEXT_PUBLIC_BASE_URL=https://yourdomain.com"
    echo ""
else
    echo "✅ NEXT_PUBLIC_BASE_URL is set to: $NEXT_PUBLIC_BASE_URL"
    echo ""
fi

# Check if the site is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Site is running on localhost:3000"
    echo ""
    
    # Test homepage metadata
    echo "📄 Testing Homepage Metadata..."
    echo "--------------------------------"
    HOMEPAGE=$(curl -s http://localhost:3000)
    
    if echo "$HOMEPAGE" | grep -q "<title>"; then
        TITLE=$(echo "$HOMEPAGE" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')
        echo "✅ Title: $TITLE"
    else
        echo "❌ Title tag not found"
    fi
    
    if echo "$HOMEPAGE" | grep -q 'meta name="description"'; then
        echo "✅ Meta description found"
    else
        echo "❌ Meta description not found"
    fi
    
    if echo "$HOMEPAGE" | grep -q 'meta property="og:url"'; then
        echo "✅ OpenGraph URL found"
    else
        echo "❌ OpenGraph URL not found"
    fi
    
    if echo "$HOMEPAGE" | grep -q 'application/ld+json'; then
        echo "✅ Structured data (JSON-LD) found"
    else
        echo "❌ Structured data not found"
    fi
    
    echo ""
    echo "📄 Testing Products Page Metadata..."
    echo "------------------------------------"
    PRODUCTS=$(curl -s http://localhost:3000/products)
    
    if echo "$PRODUCTS" | grep -q "Wholesale Leather Products"; then
        echo "✅ Products page title found"
    else
        echo "❌ Products page title not found"
    fi
    
    echo ""
    echo "🎉 Verification complete!"
    echo ""
    echo "💡 To test in production:"
    echo "   1. View page source (Ctrl+U or Cmd+Option+U)"
    echo "   2. Check that URLs use your domain, not Vercel preview URLs"
    echo "   3. Test with: https://search.google.com/test/rich-results"
    
else
    echo "❌ Site is not running on localhost:3000"
    echo "   Start it with: npm run dev"
fi

