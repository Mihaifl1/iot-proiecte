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
    s.onload = () => resolve();
    s.onerror = () =>
      reject(new Error("Nu pot încărca ESP Web Tools (verifică internetul)."));
    document.head.appendChild(s);
    // custom element se definește async după modul
    const t0 = Date.now();
    const wait = () => {
      if (customElements.get("esp-web-install-button")) return resolve();
      if (Date.now() - t0 > 15000) {
        return reject(new Error("Timeout la încărcarea ESP Web Tools."));
      }
      setTimeout(wait, 100);
    };
    s.onload = wait;
  });
  return espWebToolsLoading;
}

function supportsWebSerial() {
  return typeof navigator !== "undefined" && !!navigator.serial;
}

/**
 * Secțiune HTML: încarcă .bin pe ESP (o dată pe pagină, dacă există firmware).
 */
function renderFlashSection(p) {
  const bin = (p.firmwareBin || "").trim();
  if (!bin) {
    return `
    <section class="panel flash-panel flash-missing">
      <h2>Încarcă pe ESP (USB)</h2>
      <p class="flash-note">Firmware (.bin) nu e încă generat pentru acest proiect.
      Din Manager Python: tab <strong>Firmware</strong> → <strong>Generează BIN</strong> sau <strong>Importă BIN</strong>.</p>
    </section>`;
  }

  const chip = escapeHtml(p.chipFamily || "ESP8266");
  const binPath = escapeHtml(bin);
  const serialOk = supportsWebSerial();

  return `
    <section class="panel flash-panel" id="flash-panel">
      <h2>Încarcă pe ESP (USB)</h2>
      <p class="flash-note">
        Conectează placa pe USB, apasă butonul, alege portul serial.
        Funcționează în <strong>Chrome</strong> sau <strong>Edge</strong> (nu pe iPhone).
      </p>
      <div class="flash-meta">
        <span class="tag-pill board">${chip}</span>
        <span class="tag-pill">${binPath}</span>
      </div>
      ${
        serialOk
          ? `<div id="flash-install-host" class="flash-install-host"></div>
             <p class="flash-hint" id="flash-status">Pregătit de încărcare.</p>`
          : `<p class="num-error show">Browserul tău nu suportă Web Serial.
             Deschide site-ul în Chrome sau Edge pe PC.</p>`
      }
    </section>`;
}

/**
 * Montează butonul esp-web-install după ce e în DOM.
 * Manifest generat dinamic cu URL absolut la .bin.
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
    setStatus(String(e.message || e));
    host.innerHTML = `<p class="num-error show">${escapeHtml(
      String(e.message || e)
    )}</p>`;
    return;
  }

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

  const manifestBlob = new Blob([JSON.stringify(manifest)], {
    type: "application/json",
  });
  const manifestUrl = URL.createObjectURL(manifestBlob);

  host.innerHTML = "";
  const btn = document.createElement("esp-web-install-button");
  btn.setAttribute("manifest", manifestUrl);

  const activate = document.createElement("button");
  activate.type = "button";
  activate.className = "btn flash-btn";
  activate.slot = "activate";
  activate.textContent = "Încarcă pe ESP";
  btn.appendChild(activate);

  // mesaje unsupported
  const unsup = document.createElement("span");
  unsup.slot = "unsupported";
  unsup.className = "flash-note";
  unsup.textContent = "Browser incompatibil — folosește Chrome / Edge.";
  btn.appendChild(unsup);

  const notAllowed = document.createElement("span");
  notAllowed.slot = "not-allowed";
  notAllowed.className = "flash-note";
  notAllowed.textContent = "Permisiune serial refuzată sau pagină nesigură (HTTPS necesar).";
  btn.appendChild(notAllowed);

  host.appendChild(btn);
  setStatus("Apasă „Încarcă pe ESP”, alege portul USB, apoi Install.");
}
