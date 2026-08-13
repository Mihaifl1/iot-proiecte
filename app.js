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

function renderHeader(showBack) {
  const el = $("#site-header");
  if (!el) return;
  el.innerHTML = `
    <div class="top">
      <a class="brand" href="#/">
        <span class="logo">IoT</span>
        <span>Proiecte IoT</span>
      </a>
      ${showBack ? `<a class="back-link" href="#/">← Toate proiectele</a>` : `<span class="back-link">schemă + sketch</span>`}
    </div>`;
}

function renderHub() {
  renderHeader(false);
  $("#view-hub").classList.add("active");
  $("#view-project").classList.remove("active");

  const list = $("#project-list");
  list.innerHTML = PROJECTS.map((p) => {
    const tags = (p.tags || [])
      .map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`)
      .join("");
    const hasBin = !!(p.firmwareBin && String(p.firmwareBin).trim());
    const flashBadge = hasBin
      ? `<span class="tag-pill flash-badge">USB flash</span>`
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

function renderProject(p) {
  renderHeader(true);
  $("#view-hub").classList.remove("active");
  $("#view-project").classList.add("active");

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
      <div class="proj-num">PROIECT #${p.id}</div>
      <h1>${escapeHtml(p.title)}</h1>
      <p class="sub">${escapeHtml(p.short)} · ${escapeHtml(p.board)}</p>
    </div>

    ${flashHtml}

    <section class="panel" id="schema">
      <h2>1. Schema de conectare</h2>
      ${
        p.schemaImage
          ? `<div class="schema-img-wrap"><img class="schema-img" src="${escapeHtml(
              p.schemaImage
            )}" alt="Schema proiect #${p.id}" loading="lazy"/></div>`
          : ""
      }
      <table>
        <thead><tr><th>${escapeHtml(head[0])}</th><th>${escapeHtml(head[1])}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${warns}
    </section>

    <section class="panel">
      <h2>2. Pași rapizi</h2>
      <ol class="steps">${steps}</ol>
    </section>

    <section class="panel" id="sketch">
      <div class="code-head">
        <h2 style="margin:0">3. Sketch (cod sursă)</h2>
        <button class="btn" type="button" id="btn-copy">Copiază codul</button>
      </div>
      <p style="color:var(--muted);font-size:0.88rem;margin:0 0 8px">${escapeHtml(p.sketchName)}</p>
      <pre id="sketch-code"><code>${escapeHtml(p.sketch)}</code></pre>
    </section>

    <p style="margin-top:16px">
      <a class="btn ghost" href="#/">← Alt proiect (introdu numărul)</a>
    </p>
  `;

  $("#btn-copy").onclick = () => {
    navigator.clipboard.writeText(p.sketch).then(() => {
      const b = $("#btn-copy");
      const old = b.textContent;
      b.textContent = "Copiat!";
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
    err.textContent = "Nu există proiectul #" + String(raw).trim() + ". Încearcă 001, 002, 003…";
    err.classList.add("show");
    return;
  }
  err.classList.remove("show");
  goProject(p.id);
}

function route() {
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
      err.textContent = "Proiectul #" + id + " nu există.";
      err.classList.add("show");
    }
    return;
  }
  renderProject(p);
  window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!location.hash) location.hash = "#/";
  $("#btn-go").addEventListener("click", openFromInput);
  $("#project-number").addEventListener("keydown", (e) => {
    if (e.key === "Enter") openFromInput();
  });
  window.addEventListener("hashchange", route);
  route();
});
