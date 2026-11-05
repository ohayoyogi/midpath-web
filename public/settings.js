// Per-app MIDPath settings.
//
// MIDPath's Configuration.getProperty() looks at Java system properties before
// configuration.cfg, and every launch gets a fresh page and JVM, so an app's settings are
// passed to cheerpjInit({ javaProperties }) when it starts. Values are kept in this
// browser's localStorage, keyed by app.

/**
 * The settings an app can override. "default" leaves configuration.cfg in charge.
 * labels/notes are { ja, en }.
 */
export const SETTINGS = [
  {
    id: "immediateRepaint",
    property: "com.sun.midp.events.immediateRepaint",
    choices: ["default", "true", "false"],
    // au (KJX) games commonly call repaint() and then spin until paint() has run; that
    // only works when repaint() paints at once, so they get it by default.
    defaultFor: (target) => (isKjxTarget(target) ? "true" : "false"),
    label: { ja: "即時再描画（実験的）", en: "Immediate repaint (experimental)" },
    note: {
      ja: "repaint() を呼んだスレッドがその場で描画します。動きが滑らかになるアプリもあれば、ちらつく・固まるアプリもあります。",
      en: "Paints at once in the thread that calls repaint(). Smoother for some apps; others may flicker or freeze.",
    },
  },
  {
    id: "japaneseFont",
    // MIDPath's built-in font only has character codes 0-255; Japanese needs the BDF
    // renderer with the Shinonome font shipped in configuration.jar (lib/configuration/fonts).
    properties: (value) =>
      value === "true"
        ? ["org.thenesis.midpath.ui.fontRenderer=BDF", "org.thenesis.midpath.font.bdf.filename=/fonts/shinonome12-unicode.bdf"]
        : ["org.thenesis.midpath.ui.fontRenderer=raw"],
    choices: ["default", "true", "false"],
    defaultFor: (target) => (isKjxTarget(target) ? "true" : "false"),
    label: { ja: "日本語フォント", en: "Japanese font" },
    note: {
      ja: "日本語を表示できる 12 ドットのフォント（東雲フォント）で文字を描きます。オフのときは英数字だけの内蔵フォントです。",
      en: "Draws text with a 12-dot font that has Japanese (Shinonome). When off, the built-in font has only Latin characters.",
    },
  },
];

const STORAGE_KEY = "midpath-web.appSettings";

/** True for an au KJX app, judged by its file name. */
export function isKjxTarget(target) {
  const name = target?.kind === "local" ? target.id : target?.kind === "legacy" ? target.file : "";
  return /\.kjx$/i.test(name || "");
}

/** The value a setting takes for this app when it is left at "default". */
export function defaultValue(setting, target) {
  return setting.defaultFor ? setting.defaultFor(target) : null;
}

/** Stable key for what is being launched: "sample:<id>", "local:<file>", "legacy:<file>". */
export function appKey(target) {
  if (!target) return null;
  if (target.kind === "sample") return `sample:${target.sample.id}`;
  if (target.kind === "local") return `local:${target.id}`;
  if (target.kind === "legacy") return `legacy:${target.file}`;
  return null;
}

function loadAll() {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return all && typeof all === "object" ? all : {};
  } catch {
    return {};
  }
}

function saveAll(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

/** { settingId: value } for an app; settings left at "default" are omitted. */
export function getAppSettings(key) {
  return (key && loadAll()[key]) || {};
}

export function setAppSetting(key, id, value) {
  if (!key) return;
  const all = loadAll();
  const app = { ...(all[key] || {}) };
  if (value === "default") delete app[id];
  else app[id] = value;
  if (Object.keys(app).length) all[key] = app;
  else delete all[key];
  saveAll(all);
}

export function forgetApp(key) {
  const all = loadAll();
  if (key in all) {
    delete all[key];
    saveAll(all);
  }
}

/** Java system properties ("key=value") for an app's overridden settings. */
export function javaPropertiesFor(key, target) {
  const app = getAppSettings(key);
  const props = [];
  for (const s of SETTINGS) {
    let v = app[s.id];
    if (v == null || v === "default" || !s.choices.includes(v)) v = defaultValue(s, target);
    if (v == null) continue;
    if (s.properties) props.push(...s.properties(v));
    else props.push(`${s.property}=${v}`);
  }
  return props;
}
