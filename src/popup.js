document.addEventListener("DOMContentLoaded", async () => {
  const soundToggle = document.getElementById("soundToggle");
  const colorOptions = document.querySelectorAll(".color-option");

  // polyfill
  const storage = (typeof browser !== "undefined") ? browser.storage : chrome.storage;

  const DEFAULT_SOUND = true;
  const DEFAULT_COLOR = "yellow";

  // read saved preferences
  const res = await storage.sync.get(["soundEnabled"]);
  const prefs = {
    soundEnabled: res.soundEnabled !== undefined ? res.soundEnabled : DEFAULT_SOUND
  };

  // apply preferences to popup
  soundToggle.checked = prefs.soundEnabled;
  colorOptions.forEach(opt => {
    opt.classList.toggle("selected", opt.dataset.color === prefs.bannerColor);
  });

  // save sound toggle
  soundToggle.addEventListener("change", () => {
    storage.sync.set({ soundEnabled: soundToggle.checked });
  });

});
