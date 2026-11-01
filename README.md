# midpath-web

MIDPath × CheerpJ — run J2ME (MIDP 2.0) apps in the browser.

- `index.html` — sample gallery and your own jar library (drag & drop, stored in IndexedDB)
- `play.html` — player with a phone-style frame and an on-screen keypad
  (`?sample=<id>`, `?local=<jar file name>`, `?legacy=<file in CheerpJ /files>`)

## How to launch locally

```bash
scripts/fetch-midpath.sh        # downloads MIDPath 0.3rc2 jars into lib/
npx http-server -p 8080
```

## Samples

`samples/` contains PlanetJump and StarRaid from
[micromidp](https://github.com/ohayoyogi/micromidp), built for MIDPath.
See [samples/README.md](samples/README.md) to rebuild or add samples.

## Deploy

`.github/workflows/pages.yml` fetches the MIDPath jars and deploys the site to GitHub Pages
on every push to `main`. In the repository settings, set **Pages → Build and deployment →
Source** to **GitHub Actions**.

## License

GPLv2 (see [COPYING](COPYING)). The bundled sample games are MIT licensed; see `samples/`.
