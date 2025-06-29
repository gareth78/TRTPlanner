#!/bin/bash
set -e

echo "🔧 Ensuring local .npmrc preferences..."
cat <<EOF > .npmrc
prefer-offline=true
audit=false
fund=false
EOF

echo "🔧 Checking for node_modules..."
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules not found. Installing dependencies..."
  npm ci
else
  echo "✅ node_modules already exists. Skipping install."
fi

echo "🧹 Running initial lint and format..."
npm run lint -- --cache || true
npm run format || true

echo "🧪 Verifying unit test runner availability..."
if npx --no-install jest --clearCache > /dev/null 2>&1; then
  echo "✅ Jest is installed and cache cleared."
else
  echo "⚠️ Jest not installed or configured. Skipping test setup."
fi

echo "🚀 Pre-building with Vite for faster hot reloads and test startup..."
npm run build -- --emptyOutDir > /dev/null 2>&1

echo "🎨 Ensuring react-icons is installed..."
npm list react-icons > /dev/null 2>&1 || npm install react-icons

VERSION_FILE="src/version.ts"
CHANGELOG_FILE="CHANGELOG.md"
README_FILE="README.md"

echo "🆙 Bumping patch version in $VERSION_FILE..."
if [ -f "$VERSION_FILE" ]; then
  OLD_VERSION=$(grep -oP '\d+\.\d+\.\d+' "$VERSION_FILE")
  if [[ $OLD_VERSION =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    MAJOR="${BASH_REMATCH[1]}"
    MINOR="${BASH_REMATCH[2]}"
    PATCH="${BASH_REMATCH[3]}"
    NEW_PATCH=$(printf "%04d" $((10#$PATCH + 1)))
    NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
    sed -i.bak "s/$OLD_VERSION/$NEW_VERSION/" "$VERSION_FILE"
    rm "$VERSION_FILE.bak"
    echo "🔖 Version bumped: $OLD_VERSION → $NEW_VERSION"

    git add "$VERSION_FILE"
    git commit -m "🔖 Bump version: $OLD_VERSION → $NEW_VERSION" || echo "⚠️ Git commit failed (maybe no repo or no changes)."

    TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
    TASK_ENTRY=${TASK:-"Unspecified task"}
    ENTRY="- $TIMESTAMP · $TASK_ENTRY · v$NEW_VERSION"

    # Write to CHANGELOG.md
    if ! grep -q "^## Changelog" "$CHANGELOG_FILE"; then
      echo -e "## Changelog\n" > "$CHANGELOG_FILE"
    fi
    echo "$ENTRY" >> "$CHANGELOG_FILE"

    # Write to README.md
    if ! grep -q "^## Changelog" "$README_FILE"; then
      echo -e "\n## Changelog\n" >> "$README_FILE"
    fi
    echo "$ENTRY" >> "$README_FILE"

    git add "$CHANGELOG_FILE" "$README_FILE"
    git commit -m "📝 Update CHANGELOG and README for v$NEW_VERSION" || echo "⚠️ Git commit skipped for changelog (no changes)."
  else
    echo "⚠️ Could not parse version from $VERSION_FILE"
  fi
else
  echo "⚠️ $VERSION_FILE not found. Skipping version bump."
fi

echo "📊 Summary of files changed:"
git status --short || echo "(not in a git repo or no changes to show)"

echo "✅ Environment setup complete. Ready for Codex execution."
