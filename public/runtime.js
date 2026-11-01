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

/** Make an uploaded jar visible to Java under /str and return its path. */
export function provideJar(name, bytes) {
  const safe = name.replace(/[^\w.-]/g, "_");
  const path = `/str/${safe}`;
  cheerpOSAddStringFile(path, bytes);
  return path;
}

export function runJar(jarPath) {
  const dir = appDir();
  const classPath = [`${dir}/lib/configuration`, ...MIDPATH_JARS.map((f) => `${dir}/lib/${f}`)].join(":");
  return cheerpjRunMain("org.thenesis.midpath.main.MIDletLauncherSE", classPath, "-jar", jarPath);
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
