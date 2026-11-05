# midpath-web

MIDPath × CheerpJ — run J2ME (MIDP 2.0) apps in the browser.

- `index.html` — sample gallery and your own jar library (drag & drop, stored in IndexedDB)
- `play.html` — player with a phone-style frame and an on-screen keypad
  (`?sample=<id>`, `?local=<jar file name>`, `?legacy=<file in CheerpJ /files>`)

## How to launch locally

```bash
scripts/build-midpath.sh        # builds ohayoyogi/midpath into lib/ (needs JDK 8)
npx http-server -p 8080
```

## MIDPath runtime

The runtime jars in `lib/` are not tracked in Git. `scripts/build-midpath.sh` builds them
from [ohayoyogi/midpath](https://github.com/ohayoyogi/midpath) and
[ohayoyogi/libretro-java](https://github.com/ohayoyogi/libretro-java) at the commits pinned
in the script (override with `MIDPATH_REF` / `LIBRETRO_REF`, or build a local checkout with
`MIDPATH_DIR` / `LIBRETRO_DIR`). It needs a JDK 8 (`JAVA8_HOME`), because MIDPath compiles
with `-source 1.3 -target 1.1`.

## Japanese font

MIDPath's built-in font only covers character codes 0-255. For Japanese apps the player
switches MIDPath to its BDF renderer with the Shinonome font from MIDPath's `fonts-ja.jar`
(ohayoyogi/midpath `components/fonts-ja`), and sets `file.encoding=MS932` so text built
with `new String(byte[])` is read as Shift_JIS - per app from its settings, on by default
for KJX.

## Samples

`samples/` contains PlanetJump and StarRaid from
[micromidp](https://github.com/ohayoyogi/micromidp), built for MIDPath.
See [samples/README.md](samples/README.md) to rebuild or add samples.

## Deploy

GitHub Pages serves the `gh-pages` branch. `.github/workflows/pages.yml` builds the MIDPath
jars from [ohayoyogi/midpath](https://github.com/ohayoyogi/midpath), assembles the site
with `scripts/assemble-site.sh` and commits it to `gh-pages` on every push to `main`.

To deploy by hand:

```bash
scripts/build-midpath.sh
scripts/assemble-site.sh /tmp/site
# then copy /tmp/site over a checkout of the gh-pages branch and commit
```

## License

GPLv2 (see [COPYING](COPYING)). The bundled sample games are MIT licensed; see `samples/`.
