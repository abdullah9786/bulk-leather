#!/bin/bash

echo "🔍 Checking ALL pages for crawlable HTML content..."
echo "=================================================="
echo ""

# Test Homepage
echo "1️⃣  HOMEPAGE (/):"
curl -s http://localhost:3000 | grep -q "Trusted by global retailers" && echo "  ❌ Content NOT in HTML (client-side only)" || echo "  ❌ Content NOT in HTML"
echo ""

# Test Products listing
echo "2️⃣  PRODUCTS LISTING (/products):"
curl -s http://localhost:3000/products | grep -q "<h1>" && echo "  ✅ Has H1 tags" || echo "  ❌ No H1 in HTML"
echo ""

# Test Product detail
echo "3️⃣  PRODUCT DETAIL (/products/[slug]):"
curl -s http://localhost:3000/products/testing-material | grep -q "testing material" && echo "  ✅ Product name in HTML" || echo "  ❌ Product name NOT in HTML"
echo ""

# Test Category
echo "4️⃣  CATEGORY (/categories/[slug]):"
curl -s http://localhost:3000/categories/bags | grep -q "Bags" && echo "  ✅ Category in HTML" || echo "  ❌ Category NOT in HTML"
echo ""

# Test About
echo "5️⃣  ABOUT (/about):"
curl -s http://localhost:3000/about | grep -q "Crafting Excellence" && echo "  ✅ Content in HTML" || echo "  ❌ Content NOT in HTML"
echo ""

# Test Contact
echo "6️⃣  CONTACT (/contact):"
curl -s http://localhost:3000/contact | grep -q "Contact" && echo "  ✅ Has content" || echo "  ❌ No content in HTML"
echo ""

echo "=================================================="
echo "📊 Summary: Checking which pages need fixes..."
