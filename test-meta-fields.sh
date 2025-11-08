#!/bin/bash

echo "Testing if meta fields are saved..."
echo ""

curl -s 'http://localhost:3000/api/products/slug/leather-gloves-premium-lined' | jq -r '.data | {
  name,
  slug,
  metaTitle,
  metaDescription
}'

echo ""
echo "If metaTitle and metaDescription show actual values (not null), it worked! ✅"

