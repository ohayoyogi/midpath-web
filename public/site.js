// Shared UI helpers: bundled catalog, translations and small DOM utilities.

export const SAMPLES = [
  {
    id: "planetjump",
    title: "PlanetJump",
    jar: "samples/PlanetJump.jar",
    source: "https://github.com/ohayoyogi/micromidp/tree/main/samples/planet-jump",
    tag: "micromidp",
    art: "planet",
    desc: {
      ja: "惑星を周回し、外を向いた瞬間に1ボタンで次の惑星へ跳ぶスコアアタック。",
      en: "A one-button score attack: orbit a planet and jump when you face outward.",
    },
    keys: {
      ja: [["Enter / 5 / F1", "開始・ジャンプ・リトライ"], ["F2", "タイトルへ戻る"], ["0", "タイトルでサウンド切替"]],
      en: [["Enter / 5 / F1", "Start, jump, retry"], ["F2", "Back to title"], ["0", "Toggle sound on title"]],
    },
  },
  {
    id: "starraid",
    title: "StarRaid",
    jar: "samples/StarRaid.jar",
    source: "https://github.com/ohayoyogi/micromidp/tree/main/samples/starraid",
    tag: "micromidp",
    art: "stars",
    desc: {
      ja: "敵編隊を撃ち落とす縦スクロールシューティング。",
      en: "A vertical shooter against waves of raiders.",
    },
    keys: {
      ja: [["← ↑ → ↓ / 2 4 6 8", "移動"], ["Enter / 5 / 0", "ショット"]],
      en: [["Arrows / 2 4 6 8", "Move"], ["Enter / 5 / 0", "Fire"]],
    },
  },
  {
    id: "midpath-demos",
    title: "MIDPath Demos",
    jar: "lib/midpath-demos.jar",
    source: "https://github.com/ohayoyogi/midpath/tree/main/demos",
    tag: "MIDPath",
    art: "grid",
    desc: {
      ja: "MIDPath 付属のデモ集（テトリス風、ワーム、UI 部品など）。起動後に一覧から選びます。",
      en: "Demos bundled with MIDPath (Testris, Worm, UI widgets…). Pick one from the list.",
    },
    keys: null,
  },
];

const STRINGS = {
  ja: {
    "nav.github": "GitHub",
    "hero.title": "ブラウザで動く、ケータイ Java。",
    "hero.lead":
      "MIDPath と CheerpJ を使い、J2ME（MIDP 2.0）アプリをインストールなしでブラウザ上で動かします。サンプルを選ぶか、手元の JAR を追加してください。",
    "samples.title": "サンプル",
    "library.title": "マイライブラリ",
    "library.sub": "JAR / KJX はこのブラウザ内に保存され、外部には送信されません",
    "drop.lead": "JAR / KJX ファイルをここにドロップ",
    "drop.or": "または",
    "drop.pick": "ファイルを選択",
    "library.empty": "まだ JAR がありません。",
    "play": "起動",
    "delete": "削除",
    "download": "JAR",
    "source": "ソース",
    "added": "追加しました",
    "deleted": "削除しました",
    "confirm.delete": "「{name}」を削除しますか？",
    "err.not-a-zip": "JAR（zip）として読み込めませんでした",
    "err.no-manifest": "META-INF/MANIFEST.MF が見つかりません",
    "err.no-midlet": "マニフェストに MIDlet-1 がありません",
    "err.ext": ".jar または .kjx ファイルを選んでください",
    "err.bad-kjx": "KJX ファイルとして読み込めませんでした",
    "midlets": "{n} 個の MIDlet",
    "legacy.summary": "以前のバージョンで保存した JAR",
    "legacy.load": "読み込む（Java ランタイムを起動します）",
    "legacy.none": "見つかりませんでした。",
    "footer.about":
      "MIDPath（GPLv2）を CheerpJ で実行しています。PlanetJump / StarRaid は micromidp のサンプル（MIT License）です。",
    "player.back": "← 一覧に戻る",
    "player.loading": "Java ランタイムを準備しています…",
    "player.loading2": "初回はダウンロードに少し時間がかかります",
    "player.starting": "MIDlet を起動しています…",
    "player.exited": "MIDlet が終了しました",
    "player.restart": "もう一度起動",
    "player.notfound": "指定された JAR が見つかりません",
    "player.error": "起動に失敗しました",
    "player.controls": "操作",
    "player.keyboard": "キーボード",
    "player.view": "表示",
    "player.zoom": "拡大",
    "player.reload": "リセット",
    "player.fullscreen": "全画面",
    "player.hint": "キーボードでそのまま操作できます。下のキーパッドはタッチ操作にも対応しています。",
    "player.keymap.arrows": "方向キー",
    "player.keymap.fire": "決定",
    "player.keymap.soft": "左 / 右ソフトキー",
    "player.keymap.num": "数字キー",
    "player.log": "ログ",
    "player.copylog": "ログをコピー",
    "player.copied": "ログをクリップボードにコピーしました",
    "key.soft1": "左ソフト",
    "key.soft2": "右ソフト",
  },
  en: {
    "nav.github": "GitHub",
    "hero.title": "Feature-phone Java, in your browser.",
    "hero.lead":
      "Run J2ME (MIDP 2.0) apps in the browser with MIDPath and CheerpJ — nothing to install. Pick a sample or add a JAR of your own.",
    "samples.title": "Samples",
    "library.title": "My library",
    "library.sub": "JARs and KJXs are stored in this browser only and never uploaded",
    "drop.lead": "Drop JAR / KJX files here",
    "drop.or": "or",
    "drop.pick": "Choose files",
    "library.empty": "No JARs yet.",
    "play": "Play",
    "delete": "Delete",
    "download": "JAR",
    "source": "Source",
    "added": "Added",
    "deleted": "Deleted",
    "confirm.delete": "Delete “{name}”?",
    "err.not-a-zip": "Could not read the file as a JAR (zip)",
    "err.no-manifest": "META-INF/MANIFEST.MF is missing",
    "err.no-midlet": "The manifest has no MIDlet-1 entry",
    "err.ext": "Please choose a .jar or .kjx file",
    "err.bad-kjx": "Could not read the file as a KJX",
    "midlets": "{n} MIDlets",
    "legacy.summary": "JARs saved by the previous version",
    "legacy.load": "Load (starts the Java runtime)",
    "legacy.none": "Nothing found.",
    "footer.about":
      "Runs MIDPath (GPLv2) on CheerpJ. PlanetJump and StarRaid are micromidp samples (MIT License).",
    "player.back": "← Back",
    "player.loading": "Preparing the Java runtime…",
    "player.loading2": "The first launch downloads the runtime and may take a while",
    "player.starting": "Starting the MIDlet…",
    "player.exited": "The MIDlet has exited",
    "player.restart": "Launch again",
    "player.notfound": "The requested JAR was not found",
    "player.error": "Failed to launch",
    "player.controls": "Controls",
    "player.keyboard": "Keyboard",
    "player.view": "View",
    "player.zoom": "Zoom",
    "player.reload": "Reset",
    "player.fullscreen": "Fullscreen",
    "player.hint": "Play with the keyboard right away. The keypad below also works with touch.",
    "player.keymap.arrows": "Arrow keys",
    "player.keymap.fire": "Select",
    "player.keymap.soft": "Left / right soft key",
    "player.keymap.num": "Number keys",
    "player.log": "Log",
    "player.copylog": "Copy log",
    "player.copied": "Log copied to the clipboard",
    "key.soft1": "Soft L",
    "key.soft2": "Soft R",
  },
};

function detectLang() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "ja" || saved === "en") return saved;
  } catch {}
  return (navigator.language || "en").toLowerCase().startsWith("ja") ? "ja" : "en";
}

export let lang = detectLang();

export function t(key, vars = {}) {
  const s = STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export function applyI18n(root = document) {
  document.documentElement.lang = lang;
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  const toggle = document.getElementById("lang-toggle");
  if (toggle) toggle.textContent = lang === "ja" ? "English" : "日本語";
}

export function setupLangToggle(onChange) {
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    lang = lang === "ja" ? "en" : "ja";
    try {
      localStorage.setItem("lang", lang);
    } catch {}
    applyI18n();
    onChange?.();
  });
}

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

let toastTimer = null;
export function toast(message) {
  let node = document.getElementById("toast");
  if (!node) {
    node = el("div", { id: "toast", class: "toast", role: "status", "aria-live": "polite" });
    document.body.append(node);
  }
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("show"), 2600);
}

/** Decorative card art drawn as inline SVG (no external images). */
export function cardArt(kind, seed = "") {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 240 112");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  svg.setAttribute("aria-hidden", "true");
  let h = 7;
  for (const ch of seed + kind) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
  const add = (tag, attrs) => {
    const n = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.append(n);
  };
  for (let i = 0; i < 26; i++) {
    add("circle", { cx: rnd() * 240, cy: rnd() * 112, r: rnd() < 0.85 ? 0.8 : 1.6, fill: "#c9c3b5", opacity: 0.6 });
  }
  if (kind === "planet") {
    add("circle", { cx: 70, cy: 78, r: 26, fill: "#3f7fd8" });
    add("circle", { cx: 150, cy: 38, r: 18, fill: "#e1793c" });
    add("circle", { cx: 205, cy: 92, r: 12, fill: "#57b36b" });
    add("circle", { cx: 98, cy: 56, r: 5, fill: "#f7f2e6" });
    add("path", { d: "M98 56 Q120 30 134 36", stroke: "#f7f2e6", "stroke-width": 1.5, "stroke-dasharray": "3 4", fill: "none" });
  } else if (kind === "stars") {
    add("path", { d: "M120 74 l-12 22 h24 z", fill: "#4fb0e8" });
    add("rect", { x: 118, y: 52, width: 4, height: 12, fill: "#f2c94c" });
    add("rect", { x: 118, y: 30, width: 4, height: 12, fill: "#f2c94c" });
    for (const [x, y, c] of [[60, 22, "#e5534b"], [170, 18, "#e5534b"], [200, 42, "#c678dd"], [40, 50, "#c678dd"]]) {
      add("path", { d: `M${x} ${y} l10 -8 l10 8 l-10 10 z`, fill: c });
    }
  } else if (kind === "grid") {
    const colors = ["#e5534b", "#f2c94c", "#57b36b", "#4fb0e8", "#c678dd"];
    for (let i = 0; i < 18; i++) {
      add("rect", { x: 66 + (i % 6) * 18, y: 24 + Math.floor(i / 6) * 22, width: 16, height: 18, rx: 3, fill: colors[i % 5], opacity: 0.9 });
    }
  } else {
    const hue = Math.floor(rnd() * 360);
    add("rect", { x: 0, y: 0, width: 240, height: 112, fill: `hsl(${hue} 45% 30%)`, opacity: 0.55 });
  }
  return svg;
}
