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

/** Mini-icon SVG pe card, după tag-uri (calm, discret) */
function cardIconSvg(p) {
  const tags = (p.tags || []).map((t) => String(t).toLowerCase()).join(" ");
  const title = String(p.title || "").toLowerCase();
  const blob = tags + " " + title;

  // releu
  if (/releu|relay/.test(blob)) {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="18" height="11" rx="2" stroke="#d4a574" stroke-width="1.3"/>
      <rect x="5" y="9" width="6" height="7" rx="1" stroke="#5b9fd4" stroke-width="1"/>
      <circle cx="16" cy="12.5" r="2.5" stroke="#5eb8a8" stroke-width="1.1"/>
    </svg>`;
  }
  // motor
  if (/motor|bts|pwm/.test(blob)) {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7" stroke="#5b9fd4" stroke-width="1.3"/>
      <circle cx="12" cy="12" r="2.5" fill="#5eb8a8" opacity="0.7"/>
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke="#8b9aab" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`;
  }
  // temp / senzor
  if (/temp|ds18|senzor|sensor|irig/.test(blob)) {
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 14.5V6a2 2 0 114 0v8.5a3.5 3.5 0 11-4 0z" stroke="#8fbc8f" stroke-width="1.3"/>
      <circle cx="12" cy="16" r="1.5" fill="#5eb8a8"/>
    </svg>`;
  }
  // default ESP board
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="#5b9fd4" stroke-width="1.3"/>
    <rect x="7" y="6" width="10" height="6" rx="1" stroke="#5eb8a8" stroke-width="1"/>
    <circle cx="9" cy="16" r="1" fill="#5b9fd4"/>
    <circle cx="12" cy="16" r="1" fill="#5eb8a8"/>
    <circle cx="15" cy="16" r="1" fill="#8fbc8f"/>
  </svg>`;
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
    return `
    <a class="card" href="#/${p.id}">
      <div class="badge-num">#${p.id}</div>
      <div class="card-body">
        <h2>${escapeHtml(p.title)}</h2>
        <p>${escapeHtml(p.short)}</p>
        <div class="meta">
          <span class="tag-pill board">${escapeHtml(p.board)}</span>
          ${tags}
        </div>
      </div>
      <div class="card-icon">${cardIconSvg(p)}</div>
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

  $("#view-project").innerHTML = `
    <div class="proj-head">
      <div class="proj-num">PROIECT #${p.id}</div>
      <h1>${escapeHtml(p.title)}</h1>
      <p class="sub">${escapeHtml(p.short)} · ${escapeHtml(p.board)}</p>
    </div>

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
        <h2 style="margin:0">3. Sketch gata de upload</h2>
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
