# -*- coding: utf-8 -*-
"""Creează downloads/iot-manager.zip protejat cu parolă (aceeași ca pe site)."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "downloads"
OUT_ZIP = OUT_DIR / "iot-manager.zip"
SEVEN = Path(r"C:\Program Files\7-Zip\7z.exe")
PASSWORD = "admin123"

FILES = [
    "manager.py",
    "bin_builder.py",
    "_compile_all.py",
    "requirements.txt",
    "porneste-manager.bat",
    "setup-github-login.bat",
    "downloads/CITESTE-MANAGER.txt",
]


def main() -> int:
    missing = [f for f in FILES if not (ROOT / f).is_file()]
    if missing:
        print("Lipsesc:", missing)
        return 1
    if not SEVEN.is_file():
        print("Lipsește 7-Zip:", SEVEN)
        return 1
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if OUT_ZIP.exists():
        OUT_ZIP.unlink()
    cmd = [
        str(SEVEN),
        "a",
        "-tzip",
        f"-p{PASSWORD}",
        "-mem=ZipCrypto",
        str(OUT_ZIP),
        *FILES,
    ]
    r = subprocess.run(cmd, cwd=str(ROOT))
    if r.returncode != 0:
        return r.returncode
    print("OK", OUT_ZIP, OUT_ZIP.stat().st_size, "bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
