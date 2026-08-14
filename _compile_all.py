# -*- coding: utf-8 -*-
"""Compilează BIN pentru proiectele fără firmware și actualizează site-ul."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))

from bin_builder import FIRMWARE_DIR, compile_project
from manager import generate_js, load_json, save_json


def has_bin(project: dict) -> bool:
    pid = project.get("id")
    fw = project.get("firmwareBin") or ""
    if fw and Path(fw).is_file():
        return True
    if pid and (FIRMWARE_DIR / f"{pid}.bin").is_file():
        return True
    return False


def attach_existing(project: dict) -> dict:
    """Leagă un .bin deja compilat, dacă Manager-ul nu l-a scris încă."""
    pid = str(project.get("id", ""))
    dest = FIRMWARE_DIR / f"{pid}.bin"
    if not dest.is_file():
        return project
    project = dict(project)
    project["firmwareBin"] = f"firmware/{pid}.bin"
    manifest = FIRMWARE_DIR / f"{pid}.manifest.json"
    if manifest.is_file():
        project["firmwareManifest"] = f"firmware/{pid}.manifest.json"
    return project


def main() -> int:
    only = {a.lstrip("#") for a in sys.argv[1:] if a and not a.startswith("-")}
    force = "--force" in sys.argv
    projects = load_json()
    failed = []
    ok_ids = []
    skipped = []
    for i, p in enumerate(projects):
        pid = str(p.get("id", ""))
        if only and pid not in only and pid.lstrip("0") not in only:
            continue
        if has_bin(p) and not force:
            projects[i] = attach_existing(p)
            skipped.append(pid)
            print(f"SKIP #{pid} — BIN există deja", flush=True)
            continue
        print("=" * 60, flush=True)
        print(f"COMPILE #{pid} {p.get('title')} ({p.get('chipFamily')})", flush=True)
        ok, msg, proj = compile_project(p, auto_download_cli=True)
        print(msg, flush=True)
        if ok:
            projects[i] = proj
            ok_ids.append(pid)
            save_json(projects)
        else:
            failed.append((pid, msg[-500:]))
    save_json(projects)
    generate_js(projects)
    print("=" * 60, flush=True)
    print("OK", ok_ids, flush=True)
    print("SKIP", skipped, flush=True)
    print("FAIL", [f[0] for f in failed], flush=True)
    for pid, m in failed:
        print("--- FAIL", pid, "---", flush=True)
        print(m, flush=True)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
