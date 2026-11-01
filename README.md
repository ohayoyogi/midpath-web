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

## Samples

`samples/` contains PlanetJump and StarRaid from
[micromidp](https://github.com/ohayoyogi/micromidp), built for MIDPath.
See [samples/README.md](samples/README.md) to rebuild or add samples.

## Deploy

`.github/workflows/pages.yml` builds the MIDPath jars from
[ohayoyogi/midpath](https://github.com/ohayoyogi/midpath) and deploys the site to GitHub Pages
on every push to `main`. In the repository settings, set **Pages → Build and deployment →
Source** to **GitHub Actions**.

## License

GPLv2 (see [COPYING](COPYING)). The bundled sample games are MIT licensed; see `samples/`.
