// Jar library shared by the gallery and the player.
//
// Uploaded jars are kept in the page's own IndexedDB, not in CheerpJ's /files, so that the
// gallery can list and inspect them without starting a Java runtime. The player copies the
// selected jar into CheerpJ's /str filesystem right before launching it.

const DB_NAME = "midpath-web";
const STORE = "jars";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    let result;
    Promise.resolve(fn(store)).then((r) => (result = r));
    t.oncomplete = () => {
      db.close();
      resolve(result);
    };
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

function request(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function listJars() {
  const all = await tx("readonly", (s) => request(s.getAll()));
  return (all || []).sort((a, b) => b.addedAt - a.addedAt);
}

export async function getJar(id) {
  return tx("readonly", (s) => request(s.get(id)));
}

export async function deleteJar(id) {
  return tx("readwrite", (s) => request(s.delete(id)));
}

/** Store a jar File/Blob. Throws if it is not a zip with a MIDlet manifest. */
export async function addJar(file) {
  const buffer = await file.arrayBuffer();
  if (/\.kjx$/i.test(file.name) && !isKjx(buffer)) throw new Error("bad-kjx");
  const kjx = isKjx(buffer) ? parseKjx(buffer) : null;
  const info = await inspectJar(kjx ? kjx.jar : buffer);
  if (kjx && !info.title) info.title = kjx.jadProps["MIDlet-Name"] || "";
  const record = {
    id: file.name,
    fileName: file.name,
    kind: kjx ? "kjx" : "jar",
    size: buffer.byteLength,
    addedAt: Date.now(),
    data: new Blob([buffer], { type: kjx ? "application/octet-stream" : "application/java-archive" }),
    // A KJX wraps a jar; MIDPath loads the MIDlet classes from that jar on the classpath.
    jar: kjx ? new Blob([kjx.jar], { type: "application/java-archive" }) : null,
    ...info,
  };
  await tx("readwrite", (s) => request(s.put(record)));
  return record;
}

// ---------------------------------------------------------------------------
// KJX (au / KDDI): "KJX", header offset byte, file name, big-endian JAD length, JAD file
// name, JAD content, then the jar itself. Same layout as MIDPath's KjxInspectorME reads.

export function isKjx(buffer) {
  const b = new Uint8Array(buffer, 0, Math.min(3, buffer.byteLength));
  return b.length === 3 && b[0] === 0x4b && b[1] === 0x4a && b[2] === 0x58;
}

export function parseKjx(buffer) {
  const b = new Uint8Array(buffer);
  let p = 3;
  const need = (n) => {
    if (p + n > b.length) throw new Error("bad-kjx");
  };
  need(2);
  p += 1; // offset of the JAD (not needed: the fields below are read in order)
  const nameLen = b[p++];
  need(nameLen + 3);
  p += nameLen;
  const jadLen = (b[p] << 8) | b[p + 1];
  p += 2;
  const jadNameLen = b[p++];
  need(jadNameLen + jadLen);
  p += jadNameLen;
  const jadBytes = b.subarray(p, p + jadLen);
  p += jadLen;
  const jad = new TextDecoder("shift_jis").decode(jadBytes);
  return { jad, jadProps: parseManifest(jad), jar: buffer.slice(p) };
}

// ---------------------------------------------------------------------------
// Minimal zip reader: enough to pull META-INF/MANIFEST.MF and the icon out of a jar.

function findEntries(view) {
  // End of central directory record: last 22..65557 bytes.
  const min = Math.max(0, view.byteLength - 65557);
  let eocd = -1;
  for (let i = view.byteLength - 22; i >= min; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not-a-zip");
  const count = view.getUint16(eocd + 10, true);
  let p = view.getUint32(eocd + 16, true);
  const entries = new Map();
  const decoder = new TextDecoder();
  for (let n = 0; n < count; n++) {
    if (view.getUint32(p, true) !== 0x02014b50) break;
    const method = view.getUint16(p + 10, true);
    const csize = view.getUint32(p + 20, true);
    const nameLen = view.getUint16(p + 28, true);
    const extraLen = view.getUint16(p + 30, true);
    const commentLen = view.getUint16(p + 32, true);
    const local = view.getUint32(p + 42, true);
    const name = decoder.decode(new Uint8Array(view.buffer, view.byteOffset + p + 46, nameLen));
    entries.set(name, { method, csize, local });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

async function readEntry(view, entry) {
  const p = entry.local;
  const nameLen = view.getUint16(p + 26, true);
  const extraLen = view.getUint16(p + 28, true);
  const start = view.byteOffset + p + 30 + nameLen + extraLen;
  const raw = new Uint8Array(view.buffer, start, entry.csize);
  if (entry.method === 0) return raw.slice();
  if (entry.method !== 8 || typeof DecompressionStream === "undefined") return null;
  const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function parseManifest(text) {
  const props = {};
  let last = null;
  for (const line of text.split(/\r\n|\r|\n/)) {
    if (line.startsWith(" ") && last) {
      props[last] += line.slice(1);
    } else {
      const i = line.indexOf(":");
      if (i > 0) {
        last = line.slice(0, i).trim();
        props[last] = line.slice(i + 1).trim();
      }
    }
  }
  return props;
}

export async function inspectJar(buffer) {
  const view = new DataView(buffer);
  const entries = findEntries(view);
  const mfEntry = entries.get("META-INF/MANIFEST.MF");
  if (!mfEntry) throw new Error("no-manifest");
  const mfBytes = await readEntry(view, mfEntry);
  const props = mfBytes ? parseManifest(new TextDecoder().decode(mfBytes)) : {};

  const midlets = [];
  for (let i = 1; props[`MIDlet-${i}`]; i++) {
    const [name, icon, cls] = props[`MIDlet-${i}`].split(",").map((s) => s.trim());
    midlets.push({ name, icon, className: cls });
  }
  if (mfBytes && midlets.length === 0) throw new Error("no-midlet");

  let iconPath = props["MIDlet-Icon"] || midlets.find((m) => m.icon)?.icon || "";
  iconPath = iconPath.replace(/^\//, "");
  let icon = null;
  if (iconPath && entries.has(iconPath)) {
    const bytes = await readEntry(view, entries.get(iconPath));
    if (bytes) icon = new Blob([bytes], { type: "image/png" });
  }

  return {
    title: props["MIDlet-Name"] || midlets[0]?.name || "",
    vendor: props["MIDlet-Vendor"] || "",
    version: props["MIDlet-Version"] || "",
    description: props["MIDlet-Description"] || "",
    midlets,
    icon,
  };
}

export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
