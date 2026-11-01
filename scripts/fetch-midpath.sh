#!/usr/bin/env bash
# Download the MIDPath 0.3rc2 runtime jars into lib/.
#
# The jars are not tracked in Git (lib/.gitignore). The site and scripts/build-samples.sh
# both need them, so local development and the Pages workflow fetch the same pinned archive.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
URL="https://downloads.sourceforge.net/project/midpath/midpath/0.3rc2/midpath-0.3rc2.tar.gz"
SHA256="e235ca7470e7cdfb90e3806fbcc1b2c450db286276136a2523c7ae26a804a100"

if [ -f "$ROOT/lib/midpath.jar" ] && [ "${FORCE:-0}" != 1 ]; then
    echo "lib/midpath.jar already exists (set FORCE=1 to download again)"
    exit 0
fi

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

curl -fsSL --retry 3 -o "$TMP/midpath.tar.gz" "$URL"
echo "$SHA256  $TMP/midpath.tar.gz" | sha256sum -c -
tar xzf "$TMP/midpath.tar.gz" -C "$TMP" midpath-0.3rc2/dist
cp "$TMP"/midpath-0.3rc2/dist/*.jar "$ROOT/lib/"
ls -1 "$ROOT"/lib/*.jar | wc -l | xargs echo "jars installed in lib/:"
