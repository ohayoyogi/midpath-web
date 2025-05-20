let handleCheerpJInit = null;
let lib = null;

async function waitCheerpJInitialized() {
  if (!handleCheerpJInit) {
    handleCheerpJInit = (async () => {
      await cheerpjInit({ enableDebug: true });
      lib = await cheerpjRunLibrary("");
    })();
  }
  return handleCheerpJInit;
}

console.log("initialized");

async function getFiles() {
  const Paths = await lib.java.nio.file.Paths;
  const Files = await lib.java.nio.file.Files;

  const listStream = await Files.list(await Paths.get("/files"));
  const list = await listStream.toArray();
  const result = [];
  for (let i = 0; i < list.length; i++) {
    result.push(await (await list[i].getFileName()).toString());
  }
  return result;
}

async function installArchive(file) {
  const Paths = await lib.java.nio.file.Paths;
  const Files = await lib.java.nio.file.Files;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const filename = file.name
      const dataArray = new Uint8Array(e.target.result);
      cheerpOSAddStringFile("/str/archive.tmp", dataArray);
      const demoFileStrPath = await Paths.get("/str/archive.tmp");
      const demoFileFilesPath = await Paths.get(`/files/${filename}`);
      await Files.copy(demoFileStrPath, demoFileFilesPath);
      resolve(filename);
    };
    reader.readAsArrayBuffer(file);
  });
}

async function runMain(filename) {
  const subdir = location.pathname.split('/').slice(0,-1).join('/');
  const appdir = "/app" + subdir;

  const jarfiles = [
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
    "microbackend.jar",
    "midpath-demos.jar",
    "midpath.jar",
    "sdljava-cldc.jar",
  ].map((filename) => `${appdir}/lib/${filename}`);
  const classPath = [`${appdir}/lib/configuration`, ...jarfiles].join(":");

  return cheerpjRunMain(
    "org.thenesis.midpath.main.MIDletLauncherSE",
    classPath,
    "-jar",
    `/files/${filename}`
  );
}
