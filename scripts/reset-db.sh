#!/usr/bin/env bash
set -e

# =========================
# LOAD .env FILE (BASH)
# =========================
if [ -f ".env" ]; then
  echo "📦 Loading environment variables from .env"
  export $(grep -v '^#' .env | xargs)
else
  echo "⚠️  .env file not found"
fi

echo "🧹 Reset DB started (NODE_ENV=$NODE_ENV)"

# =========================
# SAFETY CHECK (PROD)
# =========================
if [ "$NODE_ENV" = "production" ]; then
  echo "⚠️  WARNING: You are about to RESET the PRODUCTION database."
  echo "❗ This will DELETE ALL DATA."
  read -p "Type 'RESET_PROD_DB' to continue: " CONFIRM

  if [ "$CONFIRM" != "RESET_PROD_DB" ]; then
    echo "❌ Aborted."
    exit 1
  fi
fi

# =========================
# UPLOADS (DEV ONLY)
# =========================
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
  echo "☁️ Production mode: skipping local uploads cleanup"
fi

# =========================
# PRISMA RESET (POSTGRES)
# =========================
echo "🗄️ Resetting PostgreSQL database via Prisma"

npx prisma migrate reset --force

# =========================
# SEED
# =========================
if [ "$NODE_ENV" = "production" ]; then
  echo "🌱 Running production seed"
  npm run seed:prod
else
  echo "🌱 Running development seed"
  npm run seed
fi

echo "✅ Reset DB completed successfully"
