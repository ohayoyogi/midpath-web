#!/usr/bin/env bash
# Assemble the deployable site into a directory: pages, scripts, MIDPath runtime and samples.
#
# usage: scripts/assemble-site.sh <dir> [version]
#
# Run scripts/build-midpath.sh first (lib/*.jar are not tracked). The version (default: the
# current commit) is stamped onto the page's script and stylesheet URLs, see stamp-version.sh.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:?usage: $0 <dir> [version]}"
VER="${2:-$(git -C "$ROOT" rev-parse --short HEAD)}"
ls "$ROOT"/lib/*.jar >/dev/null 2>&1 || { echo "no lib/*.jar -- run scripts/build-midpath.sh" >&2; exit 1; }
mkdir -p "$OUT"
cd "$ROOT"
cp -r index.html play.html manage.html .nojekyll public lib samples COPYING LICENSE "$OUT"/
# lib/.gitignore ignores *.jar: inside the published gh-pages tree it would hide new jars.
find "$OUT" -name .gitignore -delete
"$ROOT/scripts/stamp-version.sh" "$OUT" "$VER" >/dev/null
echo "site assembled in $OUT (version $VER)"
