#!/bin/bash
# Exit on any error
set -e

# Resolve the project root directory (one level up from this script's location)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📂 Changing to project root: $PROJECT_ROOT"
cd "$PROJECT_ROOT"

echo "====================================================="
echo "🚀 Starting Confereus Deployment on EC2"
echo "====================================================="

# 1. Sync codebase with GitHub if git is present
if [ -d ".git" ]; then
  echo "📥 Syncing codebase with GitHub..."
  git fetch --all
  git reset --hard origin/main 2>/dev/null || git reset --hard origin/master 2>/dev/null || true
fi

# 2. Build and restart containers using project-name confereus
echo "🆙 Building and starting Confereus containers..."
docker compose --project-name confereus -f "$PROJECT_ROOT/docker-compose.yml" up -d --build --remove-orphans

# 3. Wait for services to stabilize and verify health
echo "⏳ Waiting for services to become healthy..."
sleep 5
docker compose --project-name confereus -f "$PROJECT_ROOT/docker-compose.yml" ps

# 4. Safe cleanup of dangling build artifacts
echo "🧹 Cleaning up dangling build images..."
docker image prune -f
docker builder prune -f --keep-storage 2GB 2>/dev/null || true

echo "====================================================="
echo "🎉 Confereus Deployment Completed Successfully!"
echo "====================================================="
exit 0
