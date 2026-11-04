#!/usr/bin/env bash
# Build the MIDPath runtime jars from ohayoyogi/midpath and install them into lib/.
#
# usage: scripts/build-midpath.sh
#
# Environment:
#   JAVA8_HOME     JDK 8 install (needs bin/javac and jre/lib/rt.jar). MIDPath compiles with
#                  -source 1.3 -target 1.1, which newer javac no longer accepts.
#   MIDPATH_DIR    use an existing ohayoyogi/midpath checkout instead of cloning
#   LIBRETRO_DIR   use an existing ohayoyogi/libretro-java checkout instead of cloning
#   MIDPATH_REF / LIBRETRO_REF   commits to build (defaults pinned below)
#
# The jars are not tracked in Git (lib/.gitignore); local development and the Pages
# workflow both run this script.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIDPATH_REPO=https://github.com/ohayoyogi/midpath
LIBRETRO_REPO=https://github.com/ohayoyogi/libretro-java
MIDPATH_REF="${MIDPATH_REF:-0f6fa0f34e7e8caf4134398098fd5904ba985435}"
LIBRETRO_REF="${LIBRETRO_REF:-a1b9e39207b30a0ca2e13f1838afd6d8919247ab}"

if [ -z "${JAVA8_HOME:-}" ]; then
    for d in /usr/lib/jvm/java-8-openjdk-* /usr/lib/jvm/temurin-8-jdk-* /Library/Java/JavaVirtualMachines/*1.8*/Contents/Home; do
        [ -x "$d/bin/javac" ] && { JAVA8_HOME="$d"; break; }
    done
fi
JAVA8_HOME="${JAVA8_HOME:?set JAVA8_HOME to a JDK 8 install}"
RT_JAR="$JAVA8_HOME/jre/lib/rt.jar"
[ -f "$RT_JAR" ] || { echo "missing $RT_JAR -- JAVA8_HOME must point at a JDK 8" >&2; exit 1; }

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

# checkout <repo url> <commit> <dir>
checkout() {
    git init -q "$3"
    git -C "$3" fetch -q --depth 1 "$1" "$2"
    git -C "$3" checkout -q FETCH_HEAD
}

if [ -z "${MIDPATH_DIR:-}" ]; then
    MIDPATH_DIR="$WORK/midpath"
    checkout "$MIDPATH_REPO" "$MIDPATH_REF" "$MIDPATH_DIR"
fi
if [ -z "${LIBRETRO_DIR:-}" ]; then
    LIBRETRO_DIR="$WORK/libretro-java"
    checkout "$LIBRETRO_REPO" "$LIBRETRO_REF" "$LIBRETRO_DIR"
fi

# javac wrapper: build.sh passes the command unquoted, so options cannot go in --with-javac.
cat > "$WORK/javac" <<EOF
#!/bin/sh
exec "$JAVA8_HOME/bin/javac" -nowarn -encoding ISO-8859-1 "\$@"
EOF
chmod +x "$WORK/javac"
export PATH="$JAVA8_HOME/bin:$PATH"

# libretro-java: needed at build time by the microbackend libretro backend.
mkdir -p "$WORK/libretro-classes"
"$WORK/javac" -source 1.3 -target 1.1 -d "$WORK/libretro-classes" \
    "$LIBRETRO_DIR"/src/org/ohayoyogi/libretro/*.java
jar cf "$WORK/libretro-java.jar" -C "$WORK/libretro-classes" .

# build.sh writes into the source tree, so build a copy.
cp -R "$MIDPATH_DIR" "$WORK/midpath-build"
cp "$WORK/libretro-java.jar" "$WORK/midpath-build/lib/libretro-java.jar"
(
    cd "$WORK/midpath-build"
    ./build.sh --with-javac "$WORK/javac" --with-j2se-jar "$RT_JAR" > "$WORK/build.log" 2>&1
) || { tail -50 "$WORK/build.log" >&2; echo "MIDPath build failed" >&2; exit 1; }

rm -f "$ROOT"/lib/*.jar
cp "$WORK"/midpath-build/dist/*.jar "$ROOT/lib/"

# MIDPath reads its configuration as classpath resources. Ship it as a jar: CheerpJ looks up
# every class in a classpath *directory* over HTTP first, which caused one 404 per class.
"$JAVA8_HOME/bin/jar" cf "$ROOT/lib/configuration.jar" -C "$ROOT/lib/configuration" .
REV=$(git -C "$MIDPATH_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)
echo "$(ls -1 "$ROOT"/lib/*.jar | wc -l | tr -d ' ') jars installed in lib/ from ohayoyogi/midpath $REV"
