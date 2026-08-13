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
      reject(new Error(t("flashToolsFail")));
    document.head.appendChild(s);

    const t0 = Date.now();
    const wait = () => {
      if (customElements.get("esp-web-install-button")) return resolve();
      if (Date.now() - t0 > 20000) {
        return reject(new Error(t("flashTimeout")));
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

const USB_DRIVERS = {
  CH340: {
    label: "CH340 / CH341",
    hint: "NodeMCU, Wemos D1 Mini și majoritatea clonelor ESP8266.",
    href: "https://www.wch-ic.com/downloads/CH341SER_EXE.html",
    btn: "Descarcă driver CH340",
  },
  CP2102: {
    label: "CP2102 (Silicon Labs)",
    hint: "ESP32 DevKit oficial și plăci cu cip CP210x pe USB.",
    href: "https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers",
    btn: "Descarcă driver CP2102",
  },
  CH9102: {
    label: "CH9102 / CH343",
    hint: "Unele ESP32-C3 / S3 (cip WCH lângă USB).",
    href: "https://www.wch-ic.com/downloads/CH343SER_EXE.html",
    btn: "Descarcă driver CH9102",
  },
  CDC: {
    label: "USB nativ (CDC)",
    hint: "ESP32-C3 Super Mini: Windows 10/11 are deja driverul. Dacă nu apare COM, încearcă CH340.",
    href: "",
    btn: "",
  },
  FTDI: {
    label: "FTDI FT232",
    hint: "Plăci cu cip FTDI pe USB.",
    href: "https://ftdichip.com/drivers/vcp-drivers/",
    btn: "Descarcă driver FTDI",
  },
};

function inferUsbChip(p) {
  const raw = String(p.usbChip || "").trim().toUpperCase();
  if (USB_DRIVERS[raw]) return raw;
  const blob = [p.board, p.chipFamily, p.title, (p.tags || []).join(" ")]
    .join(" ")
    .toLowerCase();
  if (/ch340|ch341|nodemcu|wemos|d1\s*mini|lolin/.test(blob)) return "CH340";
  if (/cp210/.test(blob)) return "CP2102";
  if (/ch910|ch343/.test(blob)) return "CH9102";
  if (/ftdi|ft232/.test(blob)) return "FTDI";
  if (
    /esp32/.test(blob) &&
    /c3|s2|s3|super\s*mini|qt\s*py|feather/.test(blob)
  ) {
    return "CDC";
  }
  if (/esp32/.test(blob)) return "CP2102";
  return "CH340";
}

function renderDriverBlock(p) {
  const key = inferUsbChip(p);
  const d = USB_DRIVERS[key];
  const board = escapeHtmlFlash(p.board || p.chipFamily || "ESP");
  const alts = Object.keys(USB_DRIVERS)
    .filter((k) => k !== key)
    .map((k) => {
      const x = USB_DRIVERS[k];
      const label = t("drv." + k + ".label");
      if (x.href) {
        return `<a href="${x.href}" target="_blank" rel="noopener">${escapeHtmlFlash(
          label
        )}</a>`;
      }
      return escapeHtmlFlash(label);
    })
    .join(" · ");
  const download = d.href
    ? `<a class="btn ghost driver-btn" href="${d.href}" target="_blank" rel="noopener">${escapeHtmlFlash(
        t("drv." + key + ".btn")
      )}</a>`
    : `<p class="driver-ok">${escapeHtmlFlash(t("driverCdcOk"))}</p>`;
  return `
    <div class="driver-box">
      <div class="driver-kicker">${escapeHtmlFlash(t("driverKicker"))}</div>
      <div class="driver-title">${escapeHtmlFlash(t("drv." + key + ".label"))}</div>
      <p class="driver-board">${board}</p>
      <p class="driver-hint">${escapeHtmlFlash(t("drv." + key + ".hint"))}</p>
      ${download}
      <p class="driver-alts">${escapeHtmlFlash(t("driverAlts"))} ${alts}</p>
    </div>`;
}

/**
 * Secțiune vizibilă sus pe pagina proiectului.
 */
function renderFlashSection(p) {
  const bin = (p.firmwareBin || "").trim();
  const driverHtml = renderDriverBlock(p);
  if (!bin) {
    return `
    <section class="panel flash-panel flash-missing" id="flash-panel">
      <h2>⚡ ${escapeHtmlFlash(t("flashTitle"))}</h2>
      <p class="flash-note">${escapeHtmlFlash(t("flashMissing"))}</p>
      <div class="flash-actions">${driverHtml}</div>
    </section>`;
  }

  const chip = escapeHtmlFlash(p.chipFamily || "ESP8266");
  const binPath = escapeHtmlFlash(bin);
  const serialOk = supportsWebSerial();

  return `
    <section class="panel flash-panel flash-ready" id="flash-panel">
      <h2>⚡ ${escapeHtmlFlash(t("flashTitle"))}</h2>
      <p class="flash-note">${escapeHtmlFlash(t("flashNote"))}</p>
      <div class="flash-meta">
        <span class="tag-pill board">${chip}</span>
        <span class="tag-pill">${binPath}</span>
      </div>
      <div class="flash-actions">
        <div class="flash-action-main">
      ${
        serialOk
          ? `<div id="flash-install-host" class="flash-install-host">
               <button type="button" class="btn flash-btn" id="flash-btn-loading" disabled>${escapeHtmlFlash(t("flashLoading"))}</button>
             </div>
             <p class="flash-hint" id="flash-status">${escapeHtmlFlash(t("flashPrep"))}</p>
             <p class="flash-dl"><a href="${binPath}" download>${escapeHtmlFlash(t("downloadBin"))}</a> ${escapeHtmlFlash(t("downloadBinHint"))}</p>`
          : `<p class="num-error show">${escapeHtmlFlash(t("noSerial"))}</p>
             <p class="flash-dl"><a href="${binPath}" download>${escapeHtmlFlash(t("downloadBin"))}</a></p>`
      }
        </div>
        ${driverHtml}
      </div>
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
    setStatus(t("flashPrep"));
    await loadEspWebTools();
  } catch (e) {
    const msg = String(e.message || e);
    setStatus(msg);
    host.innerHTML = `<p class="num-error show">${escapeHtmlFlash(msg)}</p>
      <p class="flash-dl"><a href="${escapeHtmlFlash(bin)}" download>${escapeHtmlFlash(t("downloadBin"))}</a></p>`;
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
  activate.textContent = t("flashBtn");
  btn.appendChild(activate);

  const unsup = document.createElement("span");
  unsup.slot = "unsupported";
  unsup.className = "flash-note";
  unsup.textContent = t("unsupported");
  btn.appendChild(unsup);

  const notAllowed = document.createElement("span");
  notAllowed.slot = "not-allowed";
  notAllowed.className = "flash-note";
  notAllowed.textContent = t("notAllowed");
  btn.appendChild(notAllowed);

  host.appendChild(btn);
  setStatus(t("flashReady"));
}
