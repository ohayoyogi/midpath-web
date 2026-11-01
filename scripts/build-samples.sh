#!/usr/bin/env bash
# Build the micromidp sample games as jars that run on MIDPath (Java SE / CheerpJ).
#
# usage: scripts/build-samples.sh /path/to/micromidp
#
# micromidp builds its jars for CLDC HI, which requires preverification and a CLDC
# bootclasspath. MIDPath runs on an ordinary Java SE VM instead, so plain javac output
# against midpath.jar is enough here. The jars are written to samples/ and committed,
# because micromidp is a private repository and the Pages workflow cannot check it out.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="${1:?usage: $0 /path/to/micromidp}"
SRC="$(cd "$SRC" && pwd)"
MIDPATH_JAR="$ROOT/lib/midpath.jar"
[ -f "$MIDPATH_JAR" ] || { echo "missing $MIDPATH_JAR -- run scripts/build-midpath.sh" >&2; exit 1; }

OUT="$ROOT/samples"
mkdir -p "$OUT"
REV=$(git -C "$SRC" rev-parse --short HEAD 2>/dev/null || echo unknown)

# build <jar name> <midlet name> <midlet class> <source dir> <license file>
build() {
    local name="$1" title="$2" class="$3" srcdir="$4" license="$5"
    local work
    work=$(mktemp -d)
    mkdir -p "$work/classes/META-INF"
    # --release 8: CheerpJ runs a Java 8 class library.
    javac -nowarn -Xlint:-options --release 8 -encoding UTF-8 \
        -cp "$MIDPATH_JAR" -d "$work/classes" $(find "$SRC/$srcdir" -name '*.java')
    cp "$SRC/$license" "$work/classes/META-INF/LICENSE"
    cat > "$work/manifest.mf" <<EOF
MIDlet-Name: $title
MIDlet-Version: 1.0.0
MIDlet-Vendor: micromidp
MicroEdition-Profile: MIDP-2.0
MicroEdition-Configuration: CLDC-1.1
MIDlet-1: $title,,$class
X-Micromidp-Revision: $REV
EOF
    jar cfm "$OUT/$name.jar" "$work/manifest.mf" -C "$work/classes" .
    rm -rf "$work"
    printf '%-16s %6s B\n' "$name.jar" "$(wc -c < "$OUT/$name.jar" | tr -d ' ')"
}

build PlanetJump PlanetJump com.micromidp.planetjump.PlanetJumpMIDlet \
    samples/planet-jump/src samples/planet-jump/LICENSE
build StarRaid StarRaid StarRaidMIDlet \
    samples/starraid/src samples/starraid/LICENSE

echo "built from micromidp $REV"
