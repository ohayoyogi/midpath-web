// CheerpJ + MIDPath runtime glue. Loaded only by pages that actually start Java.

const CHEERPJ_LOADER = "https://cjrtnc.leaningtech.com/4.0/loader.js";

// MIDPath runtime jars, built from ohayoyogi/midpath into lib/ by scripts/build-midpath.sh.
const MIDPATH_JARS = [
  "avetanabt-cldc.jar",
  "cldc1.1.jar",
  "escher-cldc.jar",
  "jgl-cldc.jar",
  "jlayerme-cldc.jar",
  "jorbis-cldc.jar",
  "jsr172-jaxp.jar",
  "jsr172-jaxrpc.jar",
  "jsr179-location.jar",
  "jsr184-m3g.jar",
  "jsr205-messaging.jar",
  "jsr226-svg-core.jar",
  "jsr226-svg-midp2.jar",
  "jsr239-opengles-core.jar",
  "jsr239-opengles-jgl.jar",
  "jsr239-opengles-nio.jar",
  "kddi.jar",
  "kxml2-2.3.0.jar",
  "libretro-java.jar",
  "microbackend.jar",
  "midpath-demos.jar",
  "midpath.jar",
  "sdljava-cldc.jar",
];

let loaderPromise = null;
function loadLoader() {
  if (!loaderPromise) {
    loaderPromise = new Promise((resolve, reject) => {
      if (typeof cheerpjInit === "function") return resolve();
      const s = document.createElement("script");
      s.src = CHEERPJ_LOADER;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load CheerpJ from " + CHEERPJ_LOADER));
      document.head.append(s);
    });
  }
  return loaderPromise;
}

let initPromise = null;
export function initRuntime(options = {}) {
  if (!initPromise) {
    initPromise = (async () => {
      await loadLoader();
      await cheerpjInit({ enableDebug: !!options.debug });
    })();
  }
  return initPromise;
}

/** Directory of the site as seen from CheerpJ's /app mount (e.g. "/app/midpath-web"). */
export function appDir() {
  const subdir = location.pathname.split("/").slice(0, -1).join("/");
  return "/app" + subdir;
}

/**
 * Place a jar where MIDPath can open it and return its path.
 *
 * MIDPath opens the jar with RandomAccessFile(file, "rws") even just to read the manifest,
 * which fails on CheerpJ's read-only /app and /str mounts. So the bytes go to /str first and
 * are then copied into the writable /files (IndexedDB) mount, as the first version did.
 */
export async function provideJar(name, bytes) {
  const safe = name.replace(/[^\w.-]/g, "_");
  const strPath = `/str/${safe}`;
  cheerpOSAddStringFile(strPath, bytes);
  const lib = await cheerpjRunLibrary("");
  const Paths = await lib.java.nio.file.Paths;
  const Files = await lib.java.nio.file.Files;
  const dir = await Paths.get("/files/.run");
  if (!(await Files.isDirectory(dir))) await Files.createDirectory(dir);
  const dst = await Paths.get(`/files/.run/${safe}`);
  await Files.deleteIfExists(dst);
  await Files.copy(await Paths.get(strPath), dst);
  return `/files/.run/${safe}`;
}

/** Download a jar served with the site (e.g. "samples/PlanetJump.jar"). */
export async function fetchJar(relPath) {
  const res = await fetch(relPath, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${relPath}: HTTP ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

/**
 * Run a MIDlet suite. launchPath is handed to MIDletLauncher -jar (a .jar, or a .kjx that
 * MIDPath's KjxInspectorME reads); classJars are the jars the MIDlet classes load from.
 */
export function runJar(launchPath, classJars = [launchPath]) {
  const dir = appDir();
  // MIDletLauncher's -jar only reads the manifest; the MIDlet class itself is loaded with
  // Class.forName, so the jar has to be on the classpath too.
  // configuration.jar (built from lib/configuration/) rather than the directory itself: a
  // directory on the classpath makes CheerpJ request every class from it, one 404 each.
  const classPath = [`${dir}/lib/configuration.jar`, ...classJars, ...MIDPATH_JARS.map((f) => `${dir}/lib/${f}`)].join(":");
  return cheerpjRunMain("org.thenesis.midpath.main.MIDletLauncherSE", classPath, "-jar", launchPath);
}

/** Jars installed by the first version of this site into CheerpJ's persistent /files. */
export async function listLegacyFiles() {
  await initRuntime();
  const lib = await cheerpjRunLibrary("");
  const Paths = await lib.java.nio.file.Paths;
  const Files = await lib.java.nio.file.Files;
  const dir = await Paths.get("/files");
  if (!(await Files.isDirectory(dir))) return [];
  const list = await (await Files.list(dir)).toArray();
  const result = [];
  for (let i = 0; i < list.length; i++) {
    const name = await (await list[i].getFileName()).toString();
    if (/\.jar$/i.test(name)) result.push(name);
  }
  return result;
}
