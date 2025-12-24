#!/usr/bin/env bash
set -e

echo "🧹 Reset DB & uploads started..."

# --- DB cleanup ---
rm -f ecommerce.sqlite
rm -rf prisma/migrations

# --- Upload folders ---
UPLOAD_ROOT="uploads/products"
SIZES=("original" "thumb" "medium" "large")

for size in "${SIZES[@]}"; do
  DIR="$UPLOAD_ROOT/$size"
  mkdir -p "$DIR"
  touch "$DIR/.gitkeep"
done

# --- Clear uploaded images but keep .gitkeep ---
if [ -d "uploads" ]; then
  find uploads -type f ! -name '.gitkeep' -delete || true
fi

# --- Prisma ---
npx prisma generate
npx prisma migrate dev --name init

# --- Seed (creates images via sharp) ---
npm run seed

echo "✅ Reset DB & uploads completed"
