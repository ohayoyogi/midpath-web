#!/usr/bin/env bash
# Build the Japanese bitmap font MIDPath uses for KJX and other Japanese apps.
#
# usage: scripts/build-font.sh
#
# Merges the 12-dot Shinonome fonts (public domain, /efont/ project) - ISO 8859-1,
# JIS X 0201 half-width katakana and JIS X 0208 - into one BDF whose glyphs are named
# U+XXXX, the naming MIDPath's BDFFontContainer maps to Unicode characters. The result is
# committed (lib/configuration/fonts/), so this only needs to run to regenerate it.
#
# Needs the Debian/Ubuntu packages xfonts-shinonome and pcf2bdf, and python3.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC=/usr/share/fonts/X11/misc
OUT="$ROOT/lib/configuration/fonts/shinonome12-unicode.bdf"
for f in shnm6x12a shnm6x12r shnmk12; do
    [ -f "$SRC/$f.pcf.gz" ] || { echo "missing $SRC/$f.pcf.gz -- apt-get install xfonts-shinonome pcf2bdf" >&2; exit 1; }
done

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
for f in shnm6x12a shnm6x12r shnmk12; do
    zcat "$SRC/$f.pcf.gz" > "$WORK/$f.pcf"
    pcf2bdf -o "$WORK/$f.bdf" "$WORK/$f.pcf"
done
python3 -I "$ROOT/scripts/merge-bdf.py" "$WORK/shnm6x12a.bdf" "$WORK/shnm6x12r.bdf" "$WORK/shnmk12.bdf" "$OUT"
