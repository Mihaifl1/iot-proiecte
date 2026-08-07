#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Manager Proiecte IoT — interfață grafică
Adaugă / editează / șterge proiecte din site (data/projects.json → projects-data.js).
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import threading
import webbrowser
from copy import deepcopy
from pathlib import Path
from typing import Any

try:
    import customtkinter as ctk
except ImportError:
    print("Lipsește customtkinter. Rulează: pip install customtkinter pillow")
    sys.exit(1)

try:
    from tkinter import filedialog, messagebox
    import tkinter as tk
except ImportError:
    import Tkinter as tk  # type: ignore
    from tkFileDialog import askopenfilename  # type: ignore
    from tkMessageBox import showinfo, showerror, askyesno  # type: ignore

# ── Paths ──────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
JSON_PATH = DATA_DIR / "projects.json"
JS_PATH = ROOT / "projects-data.js"
IMAGES_DIR = ROOT / "images"
INDEX_PATH = ROOT / "index.html"
SETTINGS_PATH = DATA_DIR / "manager-settings.json"
REMOTE_NAME = "origin"
BRANCH = "main"

# Fișiere/foldere care NU se urcă pe GitHub
GIT_IGNORE_EXTRA = [
    "__pycache__/",
    "*.pyc",
    ".DS_Store",
    "Thumbs.db",
    "data/manager-settings.json",
]

# ── Theme (aliniat cu site-ul) ──────────────────────────────────────────────
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

COLORS = {
    "bg": "#09090b",
    "card": "#141416",
    "border": "#27272a",
    "text": "#fafafa",
    "muted": "#a1a1aa",
    "accent": "#3b82f6",
    "green": "#22c55e",
    "amber": "#f59e0b",
    "pink": "#f43f5e",
    "sidebar": "#0c0c0e",
    "input": "#0c0c0e",
    "hover": "#1e1e22",
    "selected": "#1e3a5f",
}

EMPTY_PROJECT: dict[str, Any] = {
    "id": "000",
    "title": "Proiect nou",
    "short": "Descriere scurtă",
    "board": "NodeMCU ESP8266",
    "tags": ["ESP8266"],
    "tiktok": "În video scrii: Proiect #000 · Link în bio",
    "sketchName": "sketch.ino",
    "wiring": [["Componentă", "Pin ESP"], ["", ""]],
    "steps": ["Upload sketch pe board."],
    "warnings": ["Nu lega 230V la pinii ESP."],
    "sketch": "// Sketch Arduino / ESP\nvoid setup() {}\nvoid loop() {}\n",
    "schemaImage": "",
}


# ── Data helpers ────────────────────────────────────────────────────────────

def ensure_data() -> list[dict[str, Any]]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    if not JSON_PATH.exists():
        # încearcă din projects-data.js
        projects = load_from_js()
        if not projects:
            projects = []
        save_json(projects)
        return projects
    return load_json()


def load_json() -> list[dict[str, Any]]:
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        return []
    return data


def save_json(projects: list[dict[str, Any]]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(projects, f, ensure_ascii=False, indent=2)
        f.write("\n")


def load_from_js() -> list[dict[str, Any]]:
    if not JS_PATH.exists():
        return []
    text = JS_PATH.read_text(encoding="utf-8")
    m = re.search(r"window\.PROJECTS\s*=\s*(\[.*?\]);\s*\n", text, re.S)
    if not m:
        return []
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return []


def generate_js(projects: list[dict[str, Any]]) -> None:
    """Scrie projects-data.js din lista de proiecte."""
    body = json.dumps(projects, ensure_ascii=False, indent=2)
    # indentează cu 2 spații ca în original
    js = (
        "/* Generat automat din data/projects.json — nu edita manual */\n"
        f"window.PROJECTS = {body};\n\n"
        "window.findProject = function (raw) {\n"
        "  if (!raw) return null;\n"
        "  var s = String(raw).trim().toUpperCase().replace(/^#/, '').replace(/^P/, '');\n"
        "  if (/^\\d+$/.test(s)) s = ('000' + s).slice(-3);\n"
        "  for (var i = 0; i < window.PROJECTS.length; i++) {\n"
        "    if (window.PROJECTS[i].id === s) return window.PROJECTS[i];\n"
        "  }\n"
        "  return null;\n"
        "};\n"
    )
    JS_PATH.write_text(js, encoding="utf-8")


def next_id(projects: list[dict[str, Any]]) -> str:
    nums = []
    for p in projects:
        try:
            nums.append(int(str(p.get("id", "0"))))
        except ValueError:
            pass
    n = (max(nums) + 1) if nums else 1
    return f"{n:03d}"


def normalize_id(raw: str) -> str:
    s = str(raw).strip().upper().replace("#", "").replace("P", "")
    if s.isdigit():
        return f"{int(s):03d}"
    return s[:6] if s else "000"


# ── Settings ────────────────────────────────────────────────────────────────

def load_settings() -> dict[str, Any]:
    defaults = {"auto_github": True}
    if not SETTINGS_PATH.exists():
        return defaults
    try:
        data = json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            defaults.update(data)
    except (OSError, json.JSONDecodeError):
        pass
    return defaults


def save_settings(settings: dict[str, Any]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SETTINGS_PATH.write_text(
        json.dumps(settings, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


# ── Git / GitHub ────────────────────────────────────────────────────────────

def _git_env() -> dict[str, str]:
    env = os.environ.copy()
    # eșuează rapid dacă nu există credentiale (fără prompt interactiv blocat)
    env["GIT_TERMINAL_PROMPT"] = "0"
    env.setdefault("GCM_INTERACTIVE", "Never")
    return env


def git_run(*args: str, timeout: int = 120) -> tuple[int, str, str]:
    try:
        r = subprocess.run(
            ["git", *args],
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
            env=_git_env(),
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0,
        )
        return r.returncode, (r.stdout or "").strip(), (r.stderr or "").strip()
    except FileNotFoundError:
        return 127, "", "Git nu este instalat sau nu e în PATH."
    except subprocess.TimeoutExpired:
        return 124, "", "Timeout la comanda git."


def ensure_git_identity() -> None:
    code, name, _ = git_run("config", "user.name")
    if code != 0 or not name:
        git_run("config", "user.name", "Mihaifl1")
    code, email, _ = git_run("config", "user.email")
    if code != 0 or not email:
        git_run("config", "user.email", "mihaifl1@users.noreply.github.com")


def ensure_gitignore() -> None:
    gi = ROOT / ".gitignore"
    existing = gi.read_text(encoding="utf-8") if gi.exists() else ""
    lines = existing.splitlines()
    changed = False
    for item in GIT_IGNORE_EXTRA:
        if item not in lines:
            lines.append(item)
            changed = True
    if changed or not gi.exists():
        text = "\n".join(lines).rstrip() + "\n"
        gi.write_text(text, encoding="utf-8")


def git_has_changes() -> bool:
    code, out, _ = git_run("status", "--porcelain")
    return code == 0 and bool(out.strip())


def push_to_github(commit_message: str) -> tuple[bool, str]:
    """
    Adaugă fișierele relevante, commit, push pe origin/main.
    Returnează (ok, mesaj_utilizator).
    """
    if not (ROOT / ".git").exists():
        return False, "Folderul nu e un repo git. Clonează repo-ul pe GitHub."

    ensure_gitignore()
    ensure_git_identity()

    # pull --rebase ca să nu eșueze push-ul dacă e ceva pe remote
    code, out, err = git_run("pull", "--rebase", REMOTE_NAME, BRANCH, timeout=90)
    if code != 0:
        # dacă e repo curat fără upstream remote issues, continuăm; altfel raportăm
        combined = f"{out}\n{err}".lower()
        if "conflict" in combined or "unmerged" in combined:
            return False, f"Conflict la git pull:\n{err or out}"
        # first push / diverged may still allow add+commit then push

    code, _, err = git_run("add", "-A")
    if code != 0:
        return False, f"git add a eșuat:\n{err}"

    if not git_has_changes():
        # totuși încearcă push (poate e commit local nepus)
        code, out, err = git_run("push", "-u", REMOTE_NAME, BRANCH, timeout=120)
        if code == 0:
            return True, "Nicio modificare nouă; remote e la zi."
        return False, f"Nimic de comis, iar push a eșuat:\n{err or out}"

    code, out, err = git_run("commit", "-m", commit_message)
    if code != 0:
        if "nothing to commit" in (out + err).lower():
            pass
        else:
            return False, f"git commit a eșuat:\n{err or out}"

    code, out, err = git_run("push", "-u", REMOTE_NAME, BRANCH, timeout=120)
    if code != 0:
        hint = (
            "\n\nVerifică autentificarea GitHub:\n"
            "• Windows Credential Manager (parolă = Personal Access Token)\n"
            "• sau: gh auth login / git credential\n"
            "• Repo: https://github.com/Mihaifl1/iot-proiecte"
        )
        return False, f"git push a eșuat:\n{err or out}{hint}"

    return True, f"GitHub actualizat: {commit_message}"


# ── Scrollable form helpers ─────────────────────────────────────────────────

class ScrollFrame(ctk.CTkScrollableFrame):
    def __init__(self, master, **kwargs):
        kwargs.setdefault("fg_color", COLORS["card"])
        kwargs.setdefault("corner_radius", 12)
        super().__init__(master, **kwargs)


def labeled_entry(parent, label: str, row: int, **entry_kw) -> ctk.CTkEntry:
    ctk.CTkLabel(
        parent, text=label, text_color=COLORS["muted"], anchor="w", font=ctk.CTkFont(size=12)
    ).grid(row=row, column=0, sticky="w", padx=12, pady=(10, 2))
    e = ctk.CTkEntry(
        parent,
        height=36,
        fg_color=COLORS["input"],
        border_color=COLORS["border"],
        **entry_kw,
    )
    e.grid(row=row + 1, column=0, sticky="ew", padx=12, pady=(0, 4))
    parent.grid_columnconfigure(0, weight=1)
    return e


def labeled_textbox(parent, label: str, row: int, height: int = 100) -> ctk.CTkTextbox:
    ctk.CTkLabel(
        parent, text=label, text_color=COLORS["muted"], anchor="w", font=ctk.CTkFont(size=12)
    ).grid(row=row, column=0, sticky="w", padx=12, pady=(10, 2))
    t = ctk.CTkTextbox(
        parent,
        height=height,
        fg_color=COLORS["input"],
        border_color=COLORS["border"],
        border_width=1,
        font=ctk.CTkFont(family="Consolas", size=12),
    )
    t.grid(row=row + 1, column=0, sticky="nsew", padx=12, pady=(0, 4))
    parent.grid_columnconfigure(0, weight=1)
    parent.grid_rowconfigure(row + 1, weight=1)
    return t


# ── Main App ────────────────────────────────────────────────────────────────

class ManagerApp(ctk.CTk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Manager Proiecte IoT · TikTok")
        self.geometry("1180x720")
        self.minsize(960, 600)
        self.configure(fg_color=COLORS["bg"])

        self.projects: list[dict[str, Any]] = ensure_data()
        self.current_index: int | None = None
        self._dirty = False
        self._list_buttons: list[ctk.CTkButton] = []
        self._wiring_rows: list[tuple[ctk.CTkEntry, ctk.CTkEntry]] = []
        self._settings = load_settings()
        self._pushing = False

        self._build_ui()
        self._refresh_list()
        if self.projects:
            self._select(0)
        else:
            self._show_empty_state()

        self.protocol("WM_DELETE_WINDOW", self._on_close)

    # ── UI layout ──────────────────────────────────────────────────────────

    def _build_ui(self) -> None:
        # Top bar
        top = ctk.CTkFrame(self, fg_color=COLORS["sidebar"], height=56, corner_radius=0)
        top.pack(fill="x", side="top")
        top.pack_propagate(False)

        ctk.CTkLabel(
            top,
            text="  IoT",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="#93c5fd",
            width=48,
        ).pack(side="left", padx=(12, 4), pady=12)

        ctk.CTkLabel(
            top,
            text="Manager Proiecte IoT",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color=COLORS["text"],
        ).pack(side="left", padx=4)

        self.status_lbl = ctk.CTkLabel(
            top, text="", text_color=COLORS["muted"], font=ctk.CTkFont(size=12)
        )
        self.status_lbl.pack(side="left", padx=16)

        ctk.CTkButton(
            top,
            text="Generează site",
            width=130,
            height=34,
            fg_color=COLORS["green"],
            hover_color="#16a34a",
            text_color="#052e16",
            font=ctk.CTkFont(weight="bold"),
            command=self._generate_site,
        ).pack(side="right", padx=(6, 14), pady=10)

        ctk.CTkButton(
            top,
            text="⬆ Push GitHub",
            width=120,
            height=34,
            fg_color="#7c3aed",
            hover_color="#6d28d9",
            command=lambda: self._sync_github("Actualizare proiecte IoT", force=True),
        ).pack(side="right", padx=6, pady=10)

        ctk.CTkButton(
            top,
            text="Previzualizare",
            width=120,
            height=34,
            fg_color=COLORS["accent"],
            command=self._preview,
        ).pack(side="right", padx=6, pady=10)

        ctk.CTkButton(
            top,
            text="Salvează",
            width=100,
            height=34,
            fg_color="#334155",
            hover_color="#475569",
            command=self._save_current,
        ).pack(side="right", padx=6, pady=10)

        self.auto_gh_var = ctk.BooleanVar(value=bool(self._settings.get("auto_github", True)))
        self.auto_gh_switch = ctk.CTkCheckBox(
            top,
            text="Auto GitHub",
            variable=self.auto_gh_var,
            command=self._on_auto_gh_toggle,
            font=ctk.CTkFont(size=12),
            text_color=COLORS["muted"],
            fg_color=COLORS["green"],
            hover_color="#16a34a",
            border_color=COLORS["border"],
        )
        self.auto_gh_switch.pack(side="right", padx=10, pady=10)

        # Body
        body = ctk.CTkFrame(self, fg_color=COLORS["bg"])
        body.pack(fill="both", expand=True, padx=0, pady=0)

        # Sidebar
        side = ctk.CTkFrame(body, fg_color=COLORS["sidebar"], width=280, corner_radius=0)
        side.pack(side="left", fill="y")
        side.pack_propagate(False)

        search_row = ctk.CTkFrame(side, fg_color="transparent")
        search_row.pack(fill="x", padx=12, pady=(14, 8))
        self.search_var = ctk.StringVar()
        self.search_var.trace_add("write", lambda *_: self._refresh_list())
        ctk.CTkEntry(
            search_row,
            placeholder_text="Caută # sau titlu…",
            textvariable=self.search_var,
            height=36,
            fg_color=COLORS["input"],
            border_color=COLORS["border"],
        ).pack(fill="x")

        btn_row = ctk.CTkFrame(side, fg_color="transparent")
        btn_row.pack(fill="x", padx=12, pady=(0, 8))
        ctk.CTkButton(
            btn_row,
            text="+ Proiect nou",
            height=34,
            fg_color=COLORS["accent"],
            command=self._add_project,
        ).pack(side="left", expand=True, fill="x", padx=(0, 4))
        ctk.CTkButton(
            btn_row,
            text="Șterge",
            height=34,
            width=80,
            fg_color=COLORS["pink"],
            hover_color="#be123c",
            command=self._delete_project,
        ).pack(side="left")

        self.list_frame = ctk.CTkScrollableFrame(
            side, fg_color=COLORS["sidebar"], corner_radius=0
        )
        self.list_frame.pack(fill="both", expand=True, padx=8, pady=(0, 12))

        # Right editor
        self.editor = ctk.CTkFrame(body, fg_color=COLORS["bg"])
        self.editor.pack(side="left", fill="both", expand=True, padx=12, pady=12)

        self.tabs = ctk.CTkTabview(
            self.editor,
            fg_color=COLORS["card"],
            segmented_button_fg_color=COLORS["sidebar"],
            segmented_button_selected_color=COLORS["accent"],
            segmented_button_unselected_color=COLORS["sidebar"],
            segmented_button_selected_hover_color="#2563eb",
            segmented_button_unselected_hover_color=COLORS["hover"],
            corner_radius=12,
        )
        self.tabs.pack(fill="both", expand=True)

        self.tab_info = self.tabs.add("Informații")
        self.tab_wiring = self.tabs.add("Cablare")
        self.tab_steps = self.tabs.add("Pași")
        self.tab_warn = self.tabs.add("Avertismente")
        self.tab_sketch = self.tabs.add("Sketch")
        self.tab_schema = self.tabs.add("Schemă foto")

        self._build_info_tab()
        self._build_wiring_tab()
        self._build_steps_tab()
        self._build_warn_tab()
        self._build_sketch_tab()
        self._build_schema_tab()

        # Footer tip
        foot = ctk.CTkLabel(
            self,
            text="  Auto GitHub ON: la Adaugă / Șterge / Salvează face commit + push pe origin/main  ·  Date: data/projects.json",
            text_color="#52525b",
            font=ctk.CTkFont(size=11),
            anchor="w",
        )
        foot.pack(fill="x", side="bottom", pady=(0, 6), padx=8)

    def _build_info_tab(self) -> None:
        f = ScrollFrame(self.tab_info)
        f.pack(fill="both", expand=True, padx=4, pady=4)
        self.ent_id = labeled_entry(f, "Număr proiect (ex: 005)", 0)
        self.ent_title = labeled_entry(f, "Titlu", 2)
        self.ent_short = labeled_entry(f, "Descriere scurtă (apare pe card)", 4)
        self.ent_board = labeled_entry(f, "Placă / board", 6)
        self.ent_tags = labeled_entry(f, "Tag-uri (separate prin virgulă)", 8)
        self.ent_tiktok = labeled_entry(f, "Text TikTok", 10)
        self.ent_sketch_name = labeled_entry(f, "Nume fișier sketch (.ino)", 12)

        tip = ctk.CTkLabel(
            f,
            text="Pe pagina principală apar: #număr · titlu · descriere · board · tag-uri.\n"
            "Pe pagina proiectului: toate câmpurile + cablare, pași, sketch, schemă.",
            text_color=COLORS["muted"],
            justify="left",
            font=ctk.CTkFont(size=12),
        )
        tip.grid(row=14, column=0, sticky="w", padx=12, pady=16)

    def _build_wiring_tab(self) -> None:
        wrap = ctk.CTkFrame(self.tab_wiring, fg_color="transparent")
        wrap.pack(fill="both", expand=True, padx=8, pady=8)

        head = ctk.CTkFrame(wrap, fg_color="transparent")
        head.pack(fill="x", pady=(0, 8))
        ctk.CTkLabel(
            head,
            text="Tabel cablare (primul rând = antet coloane)",
            text_color=COLORS["muted"],
        ).pack(side="left")
        ctk.CTkButton(
            head, text="+ Rând", width=90, height=30, command=self._add_wiring_row
        ).pack(side="right", padx=4)
        ctk.CTkButton(
            head,
            text="− Ultimul",
            width=90,
            height=30,
            fg_color="#444",
            command=self._remove_wiring_row,
        ).pack(side="right")

        self.wiring_scroll = ctk.CTkScrollableFrame(
            wrap, fg_color=COLORS["card"], corner_radius=10
        )
        self.wiring_scroll.pack(fill="both", expand=True)

        cols = ctk.CTkFrame(self.wiring_scroll, fg_color="transparent")
        cols.pack(fill="x", padx=8, pady=4)
        ctk.CTkLabel(cols, text="Coloana A", width=280, text_color="#93c5fd").pack(
            side="left", padx=4
        )
        ctk.CTkLabel(cols, text="Coloana B", width=280, text_color="#93c5fd").pack(
            side="left", padx=4
        )

    def _build_steps_tab(self) -> None:
        f = ctk.CTkFrame(self.tab_steps, fg_color="transparent")
        f.pack(fill="both", expand=True, padx=8, pady=8)
        ctk.CTkLabel(
            f,
            text="Un pas pe linie (apare ca listă numerotată pe site)",
            text_color=COLORS["muted"],
        ).pack(anchor="w", pady=(0, 6))
        self.txt_steps = ctk.CTkTextbox(
            f,
            fg_color=COLORS["input"],
            border_color=COLORS["border"],
            border_width=1,
            font=ctk.CTkFont(size=13),
        )
        self.txt_steps.pack(fill="both", expand=True)

    def _build_warn_tab(self) -> None:
        f = ctk.CTkFrame(self.tab_warn, fg_color="transparent")
        f.pack(fill="both", expand=True, padx=8, pady=8)
        ctk.CTkLabel(
            f,
            text="Un avertisment pe linie (atenții 230V, pinuri, etc.)",
            text_color=COLORS["muted"],
        ).pack(anchor="w", pady=(0, 6))
        self.txt_warn = ctk.CTkTextbox(
            f,
            fg_color=COLORS["input"],
            border_color=COLORS["border"],
            border_width=1,
            font=ctk.CTkFont(size=13),
        )
        self.txt_warn.pack(fill="both", expand=True)

    def _build_sketch_tab(self) -> None:
        f = ctk.CTkFrame(self.tab_sketch, fg_color="transparent")
        f.pack(fill="both", expand=True, padx=8, pady=8)
        row = ctk.CTkFrame(f, fg_color="transparent")
        row.pack(fill="x", pady=(0, 6))
        ctk.CTkLabel(
            row, text="Cod Arduino / ESP (se copiază pe site)", text_color=COLORS["muted"]
        ).pack(side="left")
        ctk.CTkButton(
            row, text="Încarcă .ino", width=110, height=28, command=self._load_ino
        ).pack(side="right")
        self.txt_sketch = ctk.CTkTextbox(
            f,
            fg_color="#050506",
            border_color=COLORS["border"],
            border_width=1,
            font=ctk.CTkFont(family="Consolas", size=12),
            text_color="#d4d4d8",
        )
        self.txt_sketch.pack(fill="both", expand=True)

    def _build_schema_tab(self) -> None:
        f = ctk.CTkFrame(self.tab_schema, fg_color="transparent")
        f.pack(fill="both", expand=True, padx=8, pady=8)
        ctk.CTkLabel(
            f,
            text="Imagine schemă (JPG/PNG) — se copiază în folderul images/",
            text_color=COLORS["muted"],
        ).pack(anchor="w", pady=(0, 8))

        row = ctk.CTkFrame(f, fg_color="transparent")
        row.pack(fill="x")
        self.ent_schema = ctk.CTkEntry(
            row,
            placeholder_text="images/005.jpg sau lasă gol",
            height=36,
            fg_color=COLORS["input"],
            border_color=COLORS["border"],
        )
        self.ent_schema.pack(side="left", fill="x", expand=True, padx=(0, 8))
        ctk.CTkButton(
            row, text="Alege fișier…", width=120, height=36, command=self._pick_schema
        ).pack(side="left", padx=4)
        ctk.CTkButton(
            row,
            text="Șterge path",
            width=100,
            height=36,
            fg_color="#444",
            command=lambda: self.ent_schema.delete(0, "end"),
        ).pack(side="left")

        self.schema_preview = ctk.CTkLabel(
            f,
            text="Nicio imagine selectată",
            text_color=COLORS["muted"],
            height=280,
            fg_color=COLORS["card"],
            corner_radius=12,
        )
        self.schema_preview.pack(fill="both", expand=True, pady=16)

    # ── List ────────────────────────────────────────────────────────────────

    def _filtered(self) -> list[tuple[int, dict[str, Any]]]:
        q = self.search_var.get().strip().lower()
        out = []
        for i, p in enumerate(self.projects):
            if not q:
                out.append((i, p))
                continue
            blob = f"{p.get('id','')} {p.get('title','')} {p.get('short','')} {' '.join(p.get('tags') or [])}".lower()
            if q in blob or q.lstrip("#") in str(p.get("id", "")).lower():
                out.append((i, p))
        return out

    def _refresh_list(self) -> None:
        for w in self.list_frame.winfo_children():
            w.destroy()
        self._list_buttons.clear()

        items = self._filtered()
        if not items:
            ctk.CTkLabel(
                self.list_frame,
                text="Niciun proiect.\nApasă „+ Proiect nou”.",
                text_color=COLORS["muted"],
                justify="center",
            ).pack(pady=24)
            return

        for idx, p in items:
            pid = p.get("id", "???")
            title = p.get("title", "Fără titlu")
            short = p.get("short", "")
            selected = idx == self.current_index
            btn = ctk.CTkButton(
                self.list_frame,
                text=f"  #{pid}  {title}\n  {short[:48]}",
                anchor="w",
                height=58,
                fg_color=COLORS["selected"] if selected else COLORS["card"],
                hover_color=COLORS["hover"],
                border_width=1,
                border_color=COLORS["accent"] if selected else COLORS["border"],
                text_color=COLORS["text"],
                font=ctk.CTkFont(size=13),
                command=lambda i=idx: self._select(i),
            )
            btn.pack(fill="x", pady=3)
            self._list_buttons.append(btn)

        self.status_lbl.configure(
            text=f"{len(self.projects)} proiecte" + ("  ·  nesalvat" if self._dirty else "")
        )

    def _show_empty_state(self) -> None:
        self.current_index = None
        self._clear_form()

    # ── Select / form fill ──────────────────────────────────────────────────

    def _select(self, index: int) -> None:
        if self.current_index is not None and self._dirty:
            if not messagebox.askyesno(
                "Nesalvat",
                "Ai modificări nesalvate. Continui fără a salva?\n\n(Da = pierzi modificările)",
            ):
                return
        if index < 0 or index >= len(self.projects):
            return
        self.current_index = index
        self._fill_form(self.projects[index])
        self._dirty = False
        self._refresh_list()

    def _clear_form(self) -> None:
        for ent in (
            self.ent_id,
            self.ent_title,
            self.ent_short,
            self.ent_board,
            self.ent_tags,
            self.ent_tiktok,
            self.ent_sketch_name,
            self.ent_schema,
        ):
            ent.delete(0, "end")
        for t in (self.txt_steps, self.txt_warn, self.txt_sketch):
            t.delete("1.0", "end")
        self._set_wiring([["Componentă", "Pin ESP"], ["", ""]])
        self.schema_preview.configure(text="Nicio imagine selectată", image=None)

    def _fill_form(self, p: dict[str, Any]) -> None:
        self._clear_form()
        self.ent_id.insert(0, str(p.get("id", "")))
        self.ent_title.insert(0, str(p.get("title", "")))
        self.ent_short.insert(0, str(p.get("short", "")))
        self.ent_board.insert(0, str(p.get("board", "")))
        self.ent_tags.insert(0, ", ".join(p.get("tags") or []))
        self.ent_tiktok.insert(0, str(p.get("tiktok", "")))
        self.ent_sketch_name.insert(0, str(p.get("sketchName", "")))
        self.ent_schema.insert(0, str(p.get("schemaImage", "") or ""))

        steps = p.get("steps") or []
        self.txt_steps.insert("1.0", "\n".join(steps))
        warns = p.get("warnings") or []
        self.txt_warn.insert("1.0", "\n".join(warns))
        self.txt_sketch.insert("1.0", str(p.get("sketch", "")))

        wiring = p.get("wiring") or [["A", "B"]]
        self._set_wiring(wiring)
        self._update_schema_preview()

    def _collect_form(self) -> dict[str, Any] | None:
        pid = normalize_id(self.ent_id.get())
        if not pid or pid == "000" and not self.ent_title.get().strip():
            messagebox.showerror("Eroare", "Completează numărul și titlul proiectului.")
            return None

        tags = [t.strip() for t in self.ent_tags.get().split(",") if t.strip()]
        steps = [ln.strip() for ln in self.txt_steps.get("1.0", "end").splitlines() if ln.strip()]
        warns = [ln.strip() for ln in self.txt_warn.get("1.0", "end").splitlines() if ln.strip()]
        wiring = []
        for a, b in self._wiring_rows:
            av, bv = a.get().strip(), b.get().strip()
            if av or bv:
                wiring.append([av, bv])
        if not wiring:
            wiring = [["Componentă", "Pin ESP"]]

        # id unic (except current)
        for i, p in enumerate(self.projects):
            if i != self.current_index and str(p.get("id")) == pid:
                messagebox.showerror("Eroare", f"Există deja proiectul #{pid}.")
                return None

        return {
            "id": pid,
            "title": self.ent_title.get().strip() or "Fără titlu",
            "short": self.ent_short.get().strip(),
            "board": self.ent_board.get().strip(),
            "tags": tags,
            "tiktok": self.ent_tiktok.get().strip()
            or f"În video scrii: Proiect #{pid} · Link în bio",
            "sketchName": self.ent_sketch_name.get().strip() or f"proiect_{pid}.ino",
            "wiring": wiring,
            "steps": steps,
            "warnings": warns,
            "sketch": self.txt_sketch.get("1.0", "end").rstrip("\n") + "\n",
            "schemaImage": self.ent_schema.get().strip(),
        }

    # ── Wiring rows ─────────────────────────────────────────────────────────

    def _set_wiring(self, rows: list[list[str]]) -> None:
        for child in list(self.wiring_scroll.winfo_children())[1:]:
            child.destroy()
        self._wiring_rows.clear()
        for pair in rows:
            a = pair[0] if len(pair) > 0 else ""
            b = pair[1] if len(pair) > 1 else ""
            self._add_wiring_row(a, b)

    def _add_wiring_row(self, a: str = "", b: str = "") -> None:
        row = ctk.CTkFrame(self.wiring_scroll, fg_color="transparent")
        row.pack(fill="x", padx=8, pady=3)
        ea = ctk.CTkEntry(
            row, width=280, height=32, fg_color=COLORS["input"], border_color=COLORS["border"]
        )
        eb = ctk.CTkEntry(
            row, width=280, height=32, fg_color=COLORS["input"], border_color=COLORS["border"]
        )
        ea.pack(side="left", padx=4)
        eb.pack(side="left", padx=4)
        if a:
            ea.insert(0, a)
        if b:
            eb.insert(0, b)
        self._wiring_rows.append((ea, eb))

    def _remove_wiring_row(self) -> None:
        if len(self._wiring_rows) <= 1:
            return
        ea, eb = self._wiring_rows.pop()
        ea.master.destroy()

    # ── GitHub sync ─────────────────────────────────────────────────────────

    def _on_auto_gh_toggle(self) -> None:
        self._settings["auto_github"] = bool(self.auto_gh_var.get())
        save_settings(self._settings)
        state = "ON" if self.auto_gh_var.get() else "OFF"
        self.status_lbl.configure(text=f"Auto GitHub: {state}")

    def _sync_github(self, commit_message: str, force: bool = False, silent: bool = False) -> None:
        """Commit + push pe GitHub (în thread, ca să nu înghețe UI-ul)."""
        if self._pushing:
            self.status_lbl.configure(text="Push în curs… așteaptă")
            return
        if not force and not self.auto_gh_var.get():
            if not silent:
                self.status_lbl.configure(text="Salvat local (Auto GitHub e OFF)")
            return

        self._pushing = True
        self.status_lbl.configure(text="⬆ GitHub: commit + push…")

        def work() -> None:
            ok, msg = push_to_github(commit_message)

            def done(o: bool = ok, m: str = msg, s: bool = silent) -> None:
                self._on_push_done(o, m, silent=s)

            self.after(0, done)

        threading.Thread(target=work, daemon=True).start()

    def _on_push_done(self, ok: bool, msg: str, silent: bool = False) -> None:
        self._pushing = False
        if ok:
            self.status_lbl.configure(text="✓ GitHub actualizat")
            if not silent:
                messagebox.showinfo("GitHub", msg)
        else:
            self.status_lbl.configure(text="✗ Push GitHub eșuat")
            messagebox.showerror("GitHub — push eșuat", msg)

    # ── Actions ─────────────────────────────────────────────────────────────

    def _add_project(self) -> None:
        if self.current_index is not None and self._dirty:
            if not messagebox.askyesno("Nesalvat", "Ai modificări nesalvate. Continui?"):
                return
        p = deepcopy(EMPTY_PROJECT)
        p["id"] = next_id(self.projects)
        p["title"] = f"Proiect #{p['id']}"
        p["tiktok"] = f"În video scrii: Proiect #{p['id']} · Link în bio"
        p["sketchName"] = f"proiect_{p['id']}.ino"
        self.projects.append(p)
        self.current_index = len(self.projects) - 1
        self._fill_form(p)
        self._dirty = False
        save_json(self.projects)
        generate_js(self.projects)
        self._refresh_list()
        self.status_lbl.configure(text=f"Proiect nou #{p['id']} — completează detaliile")
        self.tabs.set("Informații")
        self._sync_github(f"Adaugă proiect #{p['id']}", silent=True)

    def _delete_project(self) -> None:
        if self.current_index is None:
            messagebox.showinfo("Info", "Selectează un proiect din listă.")
            return
        p = self.projects[self.current_index]
        pid = p.get("id")
        title = p.get("title")
        if not messagebox.askyesno(
            "Șterge proiect",
            f"Ștergi definitiv proiectul #{pid} — {title}?\n\n"
            "Se actualizează site-ul local"
            + (" și se face push pe GitHub." if self.auto_gh_var.get() else "."),
        ):
            return
        del self.projects[self.current_index]
        save_json(self.projects)
        generate_js(self.projects)
        self._dirty = False
        if self.projects:
            self.current_index = min(self.current_index, len(self.projects) - 1)
            self._fill_form(self.projects[self.current_index])
        else:
            self._show_empty_state()
        self._refresh_list()
        self.status_lbl.configure(text=f"Proiect #{pid} șters local")
        self._sync_github(f"Șterge proiect #{pid} — {title}", silent=True)

    def _save_current(self) -> None:
        if self.current_index is None:
            messagebox.showinfo("Info", "Niciun proiect selectat.")
            return
        data = self._collect_form()
        if data is None:
            return
        self.projects[self.current_index] = data
        # sort by id numeric when possible
        self.projects.sort(key=lambda x: (int(x["id"]) if str(x.get("id", "")).isdigit() else 9999, x.get("id", "")))
        # re-find index after sort
        for i, p in enumerate(self.projects):
            if p["id"] == data["id"]:
                self.current_index = i
                break
        save_json(self.projects)
        generate_js(self.projects)
        self._dirty = False
        self._refresh_list()
        self.status_lbl.configure(text=f"Salvat #{data['id']} local")
        # push automat (fără popup dublu de succes local)
        if self.auto_gh_var.get():
            self._sync_github(f"Actualizează proiect #{data['id']} — {data['title']}", silent=True)
        else:
            messagebox.showinfo(
                "Salvat local",
                f"Proiect #{data['id']} salvat local.\n\n"
                "Auto GitHub e OFF — apasă „Push GitHub” ca să urci online.",
            )

    def _generate_site(self) -> None:
        # salvează formularul curent dacă e cazul
        if self.current_index is not None:
            data = self._collect_form()
            if data:
                self.projects[self.current_index] = data
        self.projects.sort(
            key=lambda x: (int(x["id"]) if str(x.get("id", "")).isdigit() else 9999, x.get("id", ""))
        )
        save_json(self.projects)
        generate_js(self.projects)
        self._dirty = False
        self._refresh_list()
        self.status_lbl.configure(text=f"Site generat · {len(self.projects)} proiecte")
        if self.auto_gh_var.get():
            self._sync_github(
                f"Generează site — {len(self.projects)} proiecte", silent=True
            )
        else:
            messagebox.showinfo(
                "Site generat",
                f"projects-data.js actualizat cu {len(self.projects)} proiecte.\n\n"
                "Auto GitHub e OFF — apasă „Push GitHub” pentru online.",
            )

    def _preview(self) -> None:
        if not INDEX_PATH.exists():
            messagebox.showerror("Eroare", f"Lipsește {INDEX_PATH}")
            return
        # regenerare rapidă
        if self.current_index is not None:
            data = self._collect_form()
            if data:
                self.projects[self.current_index] = data
                save_json(self.projects)
                generate_js(self.projects)
        webbrowser.open(INDEX_PATH.as_uri())

    def _load_ino(self) -> None:
        path = filedialog.askopenfilename(
            title="Alege fișier .ino",
            filetypes=[("Arduino sketch", "*.ino"), ("Toate", "*.*")],
        )
        if not path:
            return
        try:
            text = Path(path).read_text(encoding="utf-8", errors="replace")
        except OSError as e:
            messagebox.showerror("Eroare", str(e))
            return
        self.txt_sketch.delete("1.0", "end")
        self.txt_sketch.insert("1.0", text)
        name = Path(path).name
        self.ent_sketch_name.delete(0, "end")
        self.ent_sketch_name.insert(0, name)
        self._dirty = True

    def _pick_schema(self) -> None:
        path = filedialog.askopenfilename(
            title="Imagine schemă",
            filetypes=[
                ("Imagini", "*.jpg;*.jpeg;*.png;*.webp;*.gif"),
                ("Toate", "*.*"),
            ],
        )
        if not path:
            return
        src = Path(path)
        if self.current_index is not None:
            pid = normalize_id(self.ent_id.get()) or self.projects[self.current_index].get("id", "img")
        else:
            pid = "img"
        dest_name = f"{pid}{src.suffix.lower()}"
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        dest = IMAGES_DIR / dest_name
        try:
            shutil.copy2(src, dest)
        except OSError as e:
            messagebox.showerror("Eroare copiere", str(e))
            return
        rel = f"images/{dest_name}"
        self.ent_schema.delete(0, "end")
        self.ent_schema.insert(0, rel)
        self._update_schema_preview()
        self._dirty = True
        self.status_lbl.configure(text=f"Imagine copiată → {rel}")

    def _update_schema_preview(self) -> None:
        rel = self.ent_schema.get().strip()
        if not rel:
            self.schema_preview.configure(text="Nicio imagine selectată", image=None)
            self._schema_img_ref = None
            return
        path = ROOT / rel if not Path(rel).is_absolute() else Path(rel)
        if not path.exists():
            self.schema_preview.configure(text=f"Fișier lipsă:\n{rel}", image=None)
            self._schema_img_ref = None
            return
        try:
            from PIL import Image

            img = Image.open(path)
            img.thumbnail((480, 320))
            ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=img.size)
            self._schema_img_ref = ctk_img
            self.schema_preview.configure(text="", image=ctk_img)
        except Exception as e:
            self.schema_preview.configure(text=f"Nu pot afișa imaginea:\n{e}", image=None)
            self._schema_img_ref = None

    def _on_close(self) -> None:
        if self._dirty:
            if messagebox.askyesno("Ieșire", "Modificări nesalvate. Salvezi înainte de ieșire?"):
                self._save_current()
        self.destroy()


def main() -> None:
    app = ManagerApp()
    # centrează fereastra
    app.update_idletasks()
    w, h = 1180, 720
    x = (app.winfo_screenwidth() - w) // 2
    y = max(0, (app.winfo_screenheight() - h) // 2 - 20)
    app.geometry(f"{w}x{h}+{x}+{y}")
    app.mainloop()


if __name__ == "__main__":
    main()
