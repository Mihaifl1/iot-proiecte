/* Flash firmware pe ESP din browser (Chrome / Edge + USB) — ESP Web Tools */

const ESP_WEB_TOOLS_SRC =
  "https://unpkg.com/esp-web-tools@10.1.0/dist/web/install-button.js?module";

let espWebToolsLoading = null;

function loadEspWebTools() {
  if (customElements.get("esp-web-install-button")) {
    return Promise.resolve();
  }
  if (espWebToolsLoading) return espWebToolsLoading;

  espWebToolsLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.type = "module";
    s.src = ESP_WEB_TOOLS_SRC;
    s.onerror = () =>
      reject(new Error("Nu pot încărca ESP Web Tools (verifică internetul)."));
    document.head.appendChild(s);

    const t0 = Date.now();
    const wait = () => {
      if (customElements.get("esp-web-install-button")) return resolve();
      if (Date.now() - t0 > 20000) {
        return reject(new Error("Timeout la încărcarea ESP Web Tools."));
      }
      setTimeout(wait, 80);
    };
    // custom element se definește după ce modulul rulează
    s.onload = () => setTimeout(wait, 50);
  });
  return espWebToolsLoading;
}

function supportsWebSerial() {
  return typeof navigator !== "undefined" && !!navigator.serial;
}

function escapeHtmlFlash(s) {
  if (typeof escapeHtml === "function") return escapeHtml(s);
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Secțiune vizibilă sus pe pagina proiectului.
 */
function renderFlashSection(p) {
  const bin = (p.firmwareBin || "").trim();
  if (!bin) {
    return `
    <section class="panel flash-panel flash-missing" id="flash-panel">
      <h2>⚡ Încarcă pe ESP (USB)</h2>
      <p class="flash-note">Nu există încă fișier <strong>.bin</strong> pentru acest proiect.
      Generează-l din Manager Python → tab <strong>Firmware</strong> → <strong>Generează BIN</strong>.</p>
    </section>`;
  }

  const chip = escapeHtmlFlash(p.chipFamily || "ESP8266");
  const binPath = escapeHtmlFlash(bin);
  const serialOk = supportsWebSerial();

  return `
    <section class="panel flash-panel flash-ready" id="flash-panel">
      <h2>⚡ Încarcă pe ESP (USB)</h2>
      <p class="flash-note">
        Conectează placa pe USB → apasă butonul → alege portul COM.
        Doar <strong>Chrome</strong> sau <strong>Edge</strong> pe PC.
      </p>
      <div class="flash-meta">
        <span class="tag-pill board">${chip}</span>
        <span class="tag-pill">${binPath}</span>
      </div>
      ${
        serialOk
          ? `<div id="flash-install-host" class="flash-install-host">
               <button type="button" class="btn flash-btn" id="flash-btn-loading" disabled>Se încarcă…</button>
             </div>
             <p class="flash-hint" id="flash-status">Se pregătește uneltele de flash…</p>
             <p class="flash-dl"><a href="${binPath}" download>Descarcă .bin</a> (dacă vrei să-l urci cu Arduino IDE / esptool)</p>`
          : `<p class="num-error show">Browserul tău nu suportă Web Serial.
             Deschide site-ul în <strong>Chrome</strong> sau <strong>Edge</strong> pe calculator.</p>
             <p class="flash-dl"><a href="${binPath}" download>Descarcă .bin</a></p>`
      }
    </section>`;
}

/**
 * Montează butonul real esp-web-install (manifest static sau dinamic).
 */
async function setupFlashButton(p) {
  const host = document.getElementById("flash-install-host");
  if (!host) return;
  const bin = (p.firmwareBin || "").trim();
  if (!bin || !supportsWebSerial()) return;

  const status = document.getElementById("flash-status");
  const setStatus = (t) => {
    if (status) status.textContent = t;
  };

  try {
    setStatus("Se încarcă uneltele de flash…");
    await loadEspWebTools();
  } catch (e) {
    const msg = String(e.message || e);
    setStatus(msg);
    host.innerHTML = `<p class="num-error show">${escapeHtmlFlash(msg)}</p>
      <p class="flash-dl"><a href="${escapeHtmlFlash(bin)}" download>Descarcă .bin</a></p>`;
    return;
  }

  // Preferă manifest static din /firmware/ (cale relativă corectă la .bin)
  let manifestUrl = "";
  if (p.firmwareManifest) {
    manifestUrl = new URL(p.firmwareManifest, window.location.href).href;
  } else {
    const chipFamily = p.chipFamily || "ESP8266";
    const binUrl = new URL(bin, window.location.href).href;
    const manifest = {
      name: p.title || `Proiect #${p.id}`,
      version: String(p.id || "1"),
      new_install_prompt_erase: true,
      builds: [
        {
          chipFamily: chipFamily,
          parts: [{ path: binUrl, offset: 0 }],
        },
      ],
    };
    const blob = new Blob([JSON.stringify(manifest)], {
      type: "application/json",
    });
    manifestUrl = URL.createObjectURL(blob);
  }

  host.innerHTML = "";
  const btn = document.createElement("esp-web-install-button");
  btn.setAttribute("manifest", manifestUrl);

  const activate = document.createElement("button");
  activate.type = "button";
  activate.className = "btn flash-btn";
  activate.slot = "activate";
  activate.textContent = "Încarcă pe ESP";
  btn.appendChild(activate);

  const unsup = document.createElement("span");
  unsup.slot = "unsupported";
  unsup.className = "flash-note";
  unsup.textContent = "Browser incompatibil — folosește Chrome / Edge.";
  btn.appendChild(unsup);

  const notAllowed = document.createElement("span");
  notAllowed.slot = "not-allowed";
  notAllowed.className = "flash-note";
  notAllowed.textContent =
    "Permisiune serial refuzată sau pagină nesigură (HTTPS necesar).";
  btn.appendChild(notAllowed);

  host.appendChild(btn);
  setStatus("Apasă „Încarcă pe ESP”, alege portul USB, apoi Install.");
}
