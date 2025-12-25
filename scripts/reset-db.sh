#!/usr/bin/env bash
set -e

echo "🧹 Reset DB started (NODE_ENV=$NODE_ENV)"

rm -f ecommerce.sqlite
rm -rf prisma/migrations

if [ "$NODE_ENV" != "production" ]; then
  echo "📁 Local mode: preparing uploads folder"

  UPLOAD_ROOT="uploads/products"
  SIZES=("original" "thumb" "medium" "large")

  for size in "${SIZES[@]}"; do
    DIR="$UPLOAD_ROOT/$size"
    mkdir -p "$DIR"
    touch "$DIR/.gitkeep"
  done

  if [ -d "uploads" ]; then
    find uploads -type f ! -name '.gitkeep' -delete || true
  fi
else
  echo "☁️ Production mode: skipping local uploads"
fi

npx prisma generate
npx prisma migrate dev --name init

if [ "$NODE_ENV" = "production" ]; then
  npm run seed:prod
else
  npm run seed
fi

echo "✅ Reset DB completed"
