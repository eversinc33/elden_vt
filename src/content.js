console.log("Elden VT Banner content.js loaded!");

// polyfill for Firefox compatibility
const storage = (typeof browser !== "undefined") ? browser.storage : chrome.storage;
const soundUrl = chrome.runtime.getURL("src/assets/elden_ring_sound.mp3");

let soundEnabled = true;
let bannerColor = "yellow";

// load prefs
(async () => {
  const res = await storage.sync.get(["soundEnabled", "bannerColor"]);
  soundEnabled = res.soundEnabled !== undefined ? res.soundEnabled : true;
  bannerColor = res.bannerColor || "yellow";
})();

if (storage.onChanged) {
  storage.onChanged.addListener((changes) => {
    if (changes.soundEnabled) soundEnabled = changes.soundEnabled.newValue;
    if (changes.bannerColor) bannerColor = changes.bannerColor.newValue;
  });
}

function showEldenRingBanner(eventType) {
  const banner = document.createElement("div");
  banner.id = "elden-ring-banner";
  const imgPath = chrome.runtime.getURL(`src/assets/${eventType}.png`);
  banner.innerHTML = `<img src="${imgPath}" alt="VT ${eventType}">`;
  document.body.appendChild(banner);

  if (soundEnabled) {
    const audio = new Audio(soundUrl);
    audio.volume = 0.35;
    audio.play().catch(console.error);
  }

  setTimeout(() => banner.classList.add("show"), 50);
  setTimeout(() => {
    banner.classList.remove("show");
    setTimeout(() => banner.remove(), 500);
  }, 3000);
}

// --- VirusTotal observers ---

function deepQuery(selector, root = document) {
  const el = root.querySelector(selector);
  if (el) return el;
  const walkers = root.querySelectorAll("*");
  for (const node of walkers) {
    if (node.shadowRoot) {
      const found = deepQuery(selector, node.shadowRoot);
      if (found) return found;
    }
  }
  return null;
}

const interval = setInterval(() => {
  const btn = deepQuery('button[data-test="confirm-upload"]');
  if (btn && !btn.dataset.eldenRingAttached) {
    console.log("Found confirm upload button", btn);
    btn.addEventListener("click", () => {
      console.log("Confirm upload clicked");
      setTimeout(() => showEldenRingBanner("Upload"), 300);
    });
    btn.dataset.eldenRingAttached = "true";
    clearInterval(interval);
  }
}, 500);


const intervalZip = setInterval(() => {
  const btn = deepQuery('button[data-type="zip"]');
  if (btn && !btn.dataset.eldenRingAttached) {
    btn.addEventListener("click", () => {
      setTimeout(() => showEldenRingBanner("Download"), 300);
    });
    btn.dataset.eldenRingAttached = "true";
    clearInterval(intervalZip);
  }
}, 500);

const intervalSample = setInterval(() => {
  const btn = deepQuery('button[data-type="sample"]');
  if (btn && !btn.dataset.eldenRingAttached) {
    btn.addEventListener("click", () => {
      setTimeout(() => showEldenRingBanner("Download"), 300);
    });
    btn.dataset.eldenRingAttached = "true";
    clearInterval(intervalZip);
  }
}, 500);
