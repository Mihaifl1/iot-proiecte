/* Hub + pagină proiect — navigare pe hash #/ și #/001 */

function $(sel, root) {
  return (root || document).querySelector(sel);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getRouteId() {
  const h = location.hash.replace(/^#\/?/, "");
  if (!h || h === "/") return null;
  const m = h.match(/^(?:projects\/)?(\d{1,3}|p?\d{1,3})$/i);
  if (m) {
    let s = m[1].replace(/^p/i, "");
    return s.padStart(3, "0");
  }
  // bare number
  if (/^\d{1,3}$/.test(h)) return h.padStart(3, "0");
  return null;
}

function goHome() {
  location.hash = "#/";
}

function goProject(id) {
  location.hash = "#/" + id;
}

function isAdminRoute() {
  const h = location.hash.replace(/^#\/?/, "").toLowerCase();
  return h === "admin" || h === "manager";
}

function showView(name) {
  ["view-hub", "view-project", "view-admin"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active", id === name);
  });
}

const MANAGER_PW_SHA256 =
  "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

async function sha256hex(text) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function renderAdmin() {
  renderHeader(true);
  showView("view-admin");
  if (typeof applyStaticI18n === "function") applyStaticI18n();
  const err = $("#admin-error");
  const ok = $("#admin-ok");
  if (err) err.classList.remove("show");
  if (ok) {
    ok.hidden = true;
    ok.textContent = "";
  }
}

function setupAdminDownload() {
  const btn = $("#btn-admin-dl");
  const input = $("#admin-pass");
  if (!btn || !input) return;

  const go = async () => {
    const err = $("#admin-error");
    const ok = $("#admin-ok");
    const hex = await sha256hex(input.value || "");
    if (hex !== MANAGER_PW_SHA256) {
      if (err) {
        err.textContent = t("adminBadPw");
        err.classList.add("show");
      }
      if (ok) {
        ok.hidden = true;
        ok.textContent = "";
      }
      return;
    }
    if (err) err.classList.remove("show");
    const a = document.createElement("a");
    a.href = "downloads/iot-manager.zip";
    a.download = "iot-manager.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (ok) {
      ok.textContent = t("adminDlOk");
      ok.hidden = false;
    }
  };

  btn.addEventListener("click", go);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") go();
  });
}

function isFunTheme() {
  return document.documentElement.classList.contains("theme-fun");
}

function applyTheme(fun) {
  document.documentElement.classList.toggle("theme-fun", !!fun);
  try {
    localStorage.setItem("iot-theme", fun ? "fun" : "calm");
  } catch (e) {
    /* ignore */
  }
  const btn = document.getElementById("theme-switch");
  if (btn) {
    btn.setAttribute("aria-pressed", fun ? "true" : "false");
    btn.setAttribute("aria-label", fun ? t("themeFunOn") : t("themeFunOff"));
    btn.title = fun ? t("themeFunOn") : t("themeFunOff");
  }
}

function renderThemeSwitch() {
  const on = isFunTheme();
  return `<button type="button" class="theme-switch" id="theme-switch" aria-pressed="${
    on ? "true" : "false"
  }" aria-label="${escapeHtml(on ? t("themeFunOn") : t("themeFunOff"))}" title="${escapeHtml(
    on ? t("themeFunOn") : t("themeFunOff")
  )}">
    <span class="theme-switch-track" aria-hidden="true">
      <span class="theme-switch-knob"></span>
    </span>
  </button>`;
}

function bindThemeSwitch(root) {
  const btn = (root || document).querySelector("#theme-switch");
  if (!btn) return;
  btn.addEventListener("click", () => applyTheme(!isFunTheme()));
}

function renderHeader(showBack) {
  const el = $("#site-header");
  if (!el) return;
  const mid = showBack
    ? `<a class="back-link" href="#/">${t("backAll")}</a>`
    : `<span class="back-link">${t("tagline")}</span>`;
  el.innerHTML = `
    <div class="top">
      <a class="brand" href="#/">
        <span class="logo">IoT</span>
        <span>${escapeHtml(t("brand"))}</span>
      </a>
      <div class="top-right">
        ${mid}
        <a class="shop-nav" href="https://esp-proiecte.md/shop/">${escapeHtml(t("shopLink"))}</a>
        ${renderThemeSwitch()}
        ${typeof renderLangSwitch === "function" ? renderLangSwitch() : ""}
      </div>
    </div>`;
  if (typeof bindLangSwitch === "function") bindLangSwitch(el);
  bindThemeSwitch(el);
}

function renderHub() {
  renderHeader(false);
  showView("view-hub");

  if (typeof applyStaticI18n === "function") applyStaticI18n();
  const list = $("#project-list");
  list.innerHTML = PROJECTS.map((raw) => {
    const p = typeof localizedProject === "function" ? localizedProject(raw) : raw;
    const tags = (p.tags || [])
      .map((tag) => `<span class="tag-pill">${escapeHtml(tag)}</span>`)
      .join("");
    const hasBin = !!(p.firmwareBin && String(p.firmwareBin).trim());
    const flashBadge = hasBin
      ? `<span class="tag-pill flash-badge">${escapeHtml(t("flashBadge"))}</span>`
      : "";
    return `
    <a class="card" href="#/${p.id}">
      <div class="badge-num">#${p.id}</div>
      <div class="card-body">
        <h2>${escapeHtml(p.title)}</h2>
        <p>${escapeHtml(p.short)}</p>
        <div class="meta">
          <span class="tag-pill board">${escapeHtml(p.board)}</span>
          ${tags}
          ${flashBadge}
        </div>
      </div>
    </a>`;
  }).join("");
}

function renderProject(raw) {
  const p = typeof localizedProject === "function" ? localizedProject(raw) : raw;
  renderHeader(true);
  showView("view-project");

  const rows = p.wiring
    .slice(1)
    .map(
      ([a, b]) =>
        `<tr><td><code>${escapeHtml(a)}</code></td><td><code>${escapeHtml(b)}</code></td></tr>`
    )
    .join("");
  const head = p.wiring[0];

  const warns = (p.warnings || [])
    .map((w) => `<div class="note warn">${escapeHtml(w)}</div>`)
    .join("");
  const steps = (p.steps || [])
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join("");

  const flashHtml =
    typeof renderFlashSection === "function" ? renderFlashSection(p) : "";

  $("#view-project").innerHTML = `
    <div class="proj-head">
      <div class="proj-num">${escapeHtml(t("projectLabel", { id: p.id }))}</div>
      <h1>${escapeHtml(p.title)}</h1>
      <p class="sub">${escapeHtml(p.short)} · ${escapeHtml(p.board)}</p>
    </div>

    ${flashHtml}

    <section class="panel" id="schema">
      <h2>${escapeHtml(t("schemaTitle"))}</h2>
      ${
        p.schemaImage
          ? `<div class="schema-img-wrap"><img class="schema-img" src="${escapeHtml(
              p.schemaImage
            )}" alt="${escapeHtml(t("schemaAlt", { id: p.id }))}" loading="lazy"/></div>`
          : ""
      }
      <table>
        <thead><tr><th>${escapeHtml(head[0])}</th><th>${escapeHtml(head[1])}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${warns}
    </section>

    <section class="panel">
      <h2>${escapeHtml(t("stepsTitle"))}</h2>
      <ol class="steps">${steps}</ol>
    </section>

    <section class="panel" id="sketch">
      <div class="code-head">
        <h2 style="margin:0">${escapeHtml(t("sketchTitle"))}</h2>
        <button class="btn" type="button" id="btn-copy">${escapeHtml(t("copy"))}</button>
      </div>
      <p style="color:var(--muted);font-size:0.88rem;margin:0 0 8px">${escapeHtml(p.sketchName)}</p>
      <pre id="sketch-code"><code>${escapeHtml(p.sketch)}</code></pre>
    </section>

    <p style="margin-top:16px">
      <a class="btn ghost" href="#/">${escapeHtml(t("otherProject"))}</a>
    </p>
  `;

  $("#btn-copy").onclick = () => {
    navigator.clipboard.writeText(p.sketch).then(() => {
      const b = $("#btn-copy");
      const old = b.textContent;
      b.textContent = t("copied");
      setTimeout(() => (b.textContent = old), 1500);
    });
  };

  if (typeof setupFlashButton === "function") {
    setupFlashButton(p);
  }
}

function openFromInput() {
  const raw = $("#project-number").value;
  const err = $("#num-error");
  const p = findProject(raw);
  if (!p) {
    err.textContent = t("notFound", { id: String(raw).trim() });
    err.classList.add("show");
    return;
  }
  err.classList.remove("show");
  goProject(p.id);
}

function route() {
  if (isAdminRoute()) {
    renderAdmin();
    window.scrollTo(0, 0);
    return;
  }
  const id = getRouteId();
  if (!id) {
    renderHub();
    return;
  }
  const p = findProject(id);
  if (!p) {
    renderHub();
    const err = $("#num-error");
    if (err) {
      err.textContent = t("notFoundId", { id: id });
      err.classList.add("show");
    }
    return;
  }
  renderProject(p);
  window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof setLang === "function") setLang(getLang());
  if (!location.hash) location.hash = "#/";
  $("#btn-go").addEventListener("click", openFromInput);
  $("#project-number").addEventListener("keydown", (e) => {
    if (e.key === "Enter") openFromInput();
  });
  window.addEventListener("hashchange", route);
  setupAdminDownload();
  route();
});
