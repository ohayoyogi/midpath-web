#!/usr/bin/env bash
# Add ?v=<version> to the page's own scripts and stylesheet in a deployed copy of the site.
#
# usage: scripts/stamp-version.sh <site dir> <version>
#
# GitHub Pages lets browsers cache files for about ten minutes, so right after a deploy a
# page could run with the previous public/*.js. A versioned URL makes each deploy load its
# own files. Run on the deployed copy only; the sources keep plain URLs for local use.
set -euo pipefail
DIR="${1:?usage: $0 <site dir> <version>}"
VER="${2:?usage: $0 <site dir> <version>}"
for f in "$DIR"/*.html; do
    sed -i -E "s#(\./public/[A-Za-z0-9_-]+\.(js|css))(\?v=[A-Za-z0-9]+)?([\"'])#\1?v=$VER\4#g" "$f"
done
grep -ho "\./public/[A-Za-z0-9_-]*\.\(js\|css\)?v=$VER" "$DIR"/*.html | sort | uniq -c
