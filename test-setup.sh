#!/bin/bash

# Test script to verify the pnpm setup

echo "Testing pnpm setup..."

# Check if all required files exist
FILES=(".npmrc" ".pnpmfile.cjs" ".package-manager" "verify-pnpm.sh")
for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: $file does not exist"
        exit 1
    else
        echo "✅ $file exists"
    fi
done

# Check if package.json has the engines field
if grep -q '"engines"' package.json; then
    echo "✅ package.json has engines field"
else
    echo "❌ Error: package.json does not have engines field"
    exit 1
fi

# Check if package.json has the verify script
if grep -q '"verify":' package.json; then
    echo "✅ package.json has verify script"
else
    echo "❌ Error: package.json does not have verify script"
    exit 1
fi

# Check if README.md mentions pnpm
if grep -q "pnpm" README.md; then
    echo "✅ README.md mentions pnpm"
else
    echo "❌ Error: README.md does not mention pnpm"
    exit 1
fi

echo "✅ All tests passed! The pnpm setup is correct."
exit 0