#!/bin/bash

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "pnpm is not installed. Please install it using:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check pnpm version
PNPM_VERSION=$(pnpm --version)
echo "pnpm version: $PNPM_VERSION"

# Check if version meets requirements (>=8.0.0)
if [[ $(echo "$PNPM_VERSION" | cut -d. -f1) -lt 8 ]]; then
    echo "pnpm version 8.0.0 or higher is required."
    echo "Please upgrade pnpm using: npm install -g pnpm@latest"
    exit 1
fi

echo "pnpm setup verified successfully!"
echo "You can now run the following commands:"
echo "  pnpm install    - Install dependencies"
echo "  pnpm dev        - Start development server"
echo "  pnpm build      - Build for production"
echo "  pnpm preview    - Preview production build"

exit 0