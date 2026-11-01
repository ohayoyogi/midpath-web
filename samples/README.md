# Bundled samples

| Jar | Source | License |
|---|---|---|
| `PlanetJump.jar` | micromidp `samples/planet-jump` | MIT ([LICENSE.PlanetJump](LICENSE.PlanetJump)) |
| `StarRaid.jar` | micromidp `samples/starraid` | MIT ([LICENSE.StarRaid](LICENSE.StarRaid)) |

These jars are built for MIDPath (Java SE), not for CLDC HI: they are plain `javac --release 8`
output without preverification. The micromidp revision is recorded in each jar's
`X-Micromidp-Revision` manifest attribute.

Rebuild them from a micromidp checkout:

```bash
scripts/fetch-midpath.sh
scripts/build-samples.sh ../micromidp
```

To add another sample, add a `build` line to `scripts/build-samples.sh` and an entry to
`SAMPLES` in `public/site.js`.
