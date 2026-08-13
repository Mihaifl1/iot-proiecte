#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compilează sketch-uri Arduino/ESP → firmware/{id}.bin + manifest pentru site."""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
FIRMWARE_DIR = ROOT / "firmware"
TOOLS_DIR = ROOT / "tools"
CLI_PATH = TOOLS_DIR / "arduino-cli.exe" if sys.platform == "win32" else TOOLS_DIR / "arduino-cli"

# ESP Web Tools chipFamily values
CHIP_FAMILIES = ("ESP8266", "ESP32", "ESP32-C3", "ESP32-S2", "ESP32-S3", "ESP32-C6", "ESP32-H2")

CHIP_FQBN = {
    "ESP8266": "esp8266:esp8266:nodemcuv2",
    "ESP32": "esp32:esp32:esp32",
    # Super Mini / majoritatea C3: USB-CDC pe boot, altfel Serial dispare după flash
    "ESP32-C3": "esp32:esp32:esp32c3:CDCOnBoot=cdc",
    "ESP32-S2": "esp32:esp32:esp32s2",
    "ESP32-S3": "esp32:esp32:esp32s3",
    "ESP32-C6": "esp32:esp32:esp32c6",
    "ESP32-H2": "esp32:esp32:esp32h2",
}

CHIP_CORE = {
    "ESP8266": "esp8266:esp8266",
    "ESP32": "esp32:esp32",
    "ESP32-C3": "esp32:esp32",
    "ESP32-S2": "esp32:esp32",
    "ESP32-S3": "esp32:esp32",
    "ESP32-C6": "esp32:esp32",
    "ESP32-H2": "esp32:esp32",
}

BOARD_INDEX_URLS = [
    "https://arduino.esp8266.com/stable/package_esp8266com_index.json",
    "https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json",
]


def infer_chip_family(board: str = "", tags: list[str] | None = None, title: str = "") -> str:
    blob = " ".join(
        [board or "", title or "", " ".join(tags or [])]
    ).lower()
    if "c3" in blob:
        return "ESP32-C3"
    if "s3" in blob:
        return "ESP32-S3"
    if "s2" in blob:
        return "ESP32-S2"
    if "c6" in blob:
        return "ESP32-C6"
    if "esp32" in blob:
        return "ESP32"
    if "esp8266" in blob or "nodemcu" in blob or "wemos" in blob:
        return "ESP8266"
    return "ESP8266"


def find_arduino_cli() -> Path | None:
    if CLI_PATH.exists():
        return CLI_PATH
    which = shutil.which("arduino-cli")
    if which:
        return Path(which)
    extras = [
        Path(os.environ.get("ProgramFiles", r"C:\Program Files")) / "Arduino CLI" / "arduino-cli.exe",
        Path.home() / "scoop" / "shims" / "arduino-cli.exe",
    ]
    for p in extras:
        if p.exists():
            return p
    return None


def download_arduino_cli() -> tuple[bool, str, Path | None]:
    """Descarcă arduino-cli portabil în tools/."""
    TOOLS_DIR.mkdir(parents=True, exist_ok=True)
    if CLI_PATH.exists():
        return True, f"Deja există: {CLI_PATH}", CLI_PATH

    if sys.platform == "win32":
        url = "https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Windows_64bit.zip"
    elif sys.platform == "darwin":
        url = "https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_macOS_64bit.tar.gz"
        return False, "Pe macOS descarcă arduino-cli manual sau: brew install arduino-cli", None
    else:
        url = "https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_64bit.tar.gz"
        return False, "Pe Linux: sudo apt install arduino-cli sau descarcă de pe arduino.cc", None

    zip_path = TOOLS_DIR / "arduino-cli.zip"
    try:
        urllib.request.urlretrieve(url, zip_path)
        with zipfile.ZipFile(zip_path, "r") as zf:
            zf.extractall(TOOLS_DIR)
        zip_path.unlink(missing_ok=True)
        # uneori e în subfolder
        if not CLI_PATH.exists():
            for found in TOOLS_DIR.rglob("arduino-cli.exe"):
                shutil.copy2(found, CLI_PATH)
                break
        if not CLI_PATH.exists():
            return False, "Download OK dar nu găsesc arduino-cli.exe în arhivă.", None
        return True, f"Descărcat: {CLI_PATH}", CLI_PATH
    except Exception as e:
        return False, f"Download arduino-cli eșuat: {e}", None


def _run_cli(cli: Path, *args: str, timeout: int = 600) -> tuple[int, str, str]:
    creation = subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
    try:
        r = subprocess.run(
            [str(cli), *args],
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
            creationflags=creation,
        )
        return r.returncode, r.stdout or "", r.stderr or ""
    except subprocess.TimeoutExpired:
        return 124, "", "Timeout arduino-cli"
    except FileNotFoundError:
        return 127, "", "arduino-cli nu e găsit"


def ensure_cores(cli: Path, chip: str) -> tuple[bool, str]:
    core = CHIP_CORE.get(chip)
    if not core:
        return False, f"Chip necunoscut: {chip}"

    # board indexes
    code, out, err = _run_cli(cli, "config", "init", "--overwrite", timeout=60)
    for url in BOARD_INDEX_URLS:
        _run_cli(cli, "config", "add", "board_manager.additional_urls", url, timeout=30)

    code, out, err = _run_cli(cli, "core", "update-index", timeout=300)
    if code != 0:
        return False, f"core update-index eșuat:\n{err or out}"

    code, out, err = _run_cli(cli, "core", "install", core, timeout=900)
    if code != 0 and "already installed" not in (out + err).lower():
        # poate e deja instalat
        code2, out2, err2 = _run_cli(cli, "core", "list", timeout=60)
        if core.split(":")[0] not in (out2 + err2):
            return False, f"core install {core} eșuat:\n{err or out}"
    return True, f"Core OK: {core}"


def ensure_libs(cli: Path, sketch: str) -> tuple[bool, str]:
    """Instalează librării detectate din #include."""
    needed = []
    if "OneWire.h" in sketch or "OneWire.h" in sketch:
        needed.append("OneWire")
    if "DallasTemperature.h" in sketch:
        needed.append("DallasTemperature")
    if "PubSubClient.h" in sketch:
        needed.append("PubSubClient")
    if "ArduinoJson.h" in sketch:
        needed.append("ArduinoJson")
    if "DHT.h" in sketch:
        needed.append("DHT sensor library")
        needed.append("Adafruit Unified Sensor")
    if "Adafruit_NeoPixel.h" in sketch:
        needed.append("Adafruit NeoPixel")
    if "Adafruit_SSD1306.h" in sketch:
        needed.append("Adafruit SSD1306")
        needed.append("Adafruit GFX Library")
    if "ESP32Servo.h" in sketch:
        needed.append("ESP32Servo")
    msgs = []
    for lib in needed:
        code, out, err = _run_cli(cli, "lib", "install", lib, timeout=180)
        if code != 0 and "already installed" not in (out + err).lower():
            msgs.append(f"{lib}: {err or out}")
        else:
            msgs.append(f"{lib}: OK")
    return True, "; ".join(msgs) if msgs else "Fără librării extra"


def write_manifest(project: dict[str, Any], bin_name: str) -> Path:
    FIRMWARE_DIR.mkdir(parents=True, exist_ok=True)
    chip = project.get("chipFamily") or "ESP8266"
    pid = project.get("id", "000")
    manifest = {
        "name": project.get("title") or f"Proiect #{pid}",
        "version": str(pid),
        "new_install_prompt_erase": True,
        "builds": [
            {
                "chipFamily": chip,
                "parts": [{"path": bin_name, "offset": 0}],
            }
        ],
    }
    path = FIRMWARE_DIR / f"{pid}.manifest.json"
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return path


def import_bin_file(
    project: dict[str, Any], src_bin: Path
) -> tuple[bool, str, dict[str, Any]]:
    """Copiază un .bin existent în firmware/{id}.bin."""
    if not src_bin.exists():
        return False, f"Fișier inexistent: {src_bin}", project
    pid = str(project.get("id", "000"))
    chip = project.get("chipFamily") or infer_chip_family(
        project.get("board", ""), project.get("tags"), project.get("title", "")
    )
    project = dict(project)
    project["chipFamily"] = chip
    FIRMWARE_DIR.mkdir(parents=True, exist_ok=True)
    dest_name = f"{pid}.bin"
    dest = FIRMWARE_DIR / dest_name
    shutil.copy2(src_bin, dest)
    write_manifest(project, dest_name)
    project["firmwareBin"] = f"firmware/{dest_name}"
    project["firmwareManifest"] = f"firmware/{pid}.manifest.json"
    size_kb = dest.stat().st_size / 1024
    return True, f"BIN importat: {dest} ({size_kb:.1f} KB)", project


def _score_app_bin(path: Path, sketch_name: str) -> int:
    n = path.name.lower()
    s = 0
    if sketch_name.lower() in n:
        s += 10
    if "merged" in n:
        s += 40
    if "bootloader" in n or "partitions" in n or "boot_app0" in n:
        s -= 30
    if n.endswith(".ino.bin") or n == f"{sketch_name}.bin".lower():
        s += 5
    return s


def _pick_and_store_bin(
    out_dir: Path, sketch_name: str, chip: str, pid: str
) -> tuple[bool, str, Path | None, str | None]:
    """
    Alege imaginea corectă pentru flash din browser (offset 0).
    Preferă *.merged.bin (ESP32: bootloader+partitions+app).
    ESP8266: sketch.ino.bin e suficient la 0x0.
    """
    bins = list(out_dir.glob("*.bin"))
    if not bins:
        return False, "Compilare OK dar nu există .bin în output.", None, None

    FIRMWARE_DIR.mkdir(parents=True, exist_ok=True)
    dest_name = f"{pid}.bin"
    dest = FIRMWARE_DIR / dest_name

    merged = [p for p in bins if "merged" in p.name.lower()]
    if merged:
        merged.sort(key=lambda p: p.stat().st_size, reverse=True)
        shutil.copy2(merged[0], dest)
        return True, f"Folosit merged image ({merged[0].name}) — flash la offset 0.", dest, dest_name

    bins.sort(key=lambda p: _score_app_bin(p, sketch_name), reverse=True)
    src = bins[0]
    shutil.copy2(src, dest)

    if chip.upper().startswith("ESP32") and "merged" not in src.name.lower():
        return (
            True,
            f"Folosit {src.name}. Pe ESP32, merged.bin e preferat; "
            "dacă flash-ul din browser eșuează, Importă BIN merged din Arduino IDE.",
            dest,
            dest_name,
        )
    return True, f"Folosit {src.name}.", dest, dest_name


def compile_project(project: dict[str, Any], auto_download_cli: bool = True) -> tuple[bool, str, dict[str, Any]]:
    """
    Compilează sketch-ul din project → firmware/{id}.bin.
    Returnează (ok, mesaj, project_actualizat).
    """
    project = dict(project)
    sketch = project.get("sketch") or ""
    if not sketch.strip():
        return False, "Sketch gol — completează tab-ul Sketch.", project

    pid = str(project.get("id", "000"))
    chip = project.get("chipFamily") or infer_chip_family(
        project.get("board", ""), project.get("tags"), project.get("title", "")
    )
    project["chipFamily"] = chip
    fqbn = CHIP_FQBN.get(chip)
    if not fqbn:
        return False, f"Nu am FQBN pentru chip {chip}", project

    cli = find_arduino_cli()
    if not cli and auto_download_cli:
        ok, msg, cli = download_arduino_cli()
        if not ok:
            return (
                False,
                msg
                + "\n\nAlternativ: compilează în Arduino IDE → Export compiled Binary, "
                "apoi folosește «Importă BIN».",
                project,
            )
    if not cli:
        return (
            False,
            "arduino-cli lipsește.\n"
            "Rulează din nou «Generează BIN» (descarcă automat) sau «Importă BIN».",
            project,
        )

    ok, msg = ensure_cores(cli, chip)
    if not ok:
        return False, msg, project

    ensure_libs(cli, sketch)

    # sketch folder: nume fără .ino
    raw_name = project.get("sketchName") or f"proiect_{pid}.ino"
    sketch_name = Path(raw_name).stem
    # sanitizare
    sketch_name = re.sub(r"[^\w\-]", "_", sketch_name) or f"proiect_{pid}"

    with tempfile.TemporaryDirectory(prefix="iot_build_") as tmp:
        tmp_path = Path(tmp)
        sketch_dir = tmp_path / sketch_name
        sketch_dir.mkdir(parents=True)
        ino_path = sketch_dir / f"{sketch_name}.ino"
        ino_path.write_text(sketch, encoding="utf-8")

        out_dir = tmp_path / "out"
        out_dir.mkdir()

        code, out, err = _run_cli(
            cli,
            "compile",
            "--fqbn",
            fqbn,
            "--output-dir",
            str(out_dir),
            str(sketch_dir),
            timeout=600,
        )
        log = (out + "\n" + err).strip()
        if code != 0:
            # tail log
            tail = "\n".join(log.splitlines()[-40:])
            return False, f"Compilare eșuată (FQBN {fqbn}):\n{tail}", project

        ok_pick, pick_msg, dest, dest_name = _pick_and_store_bin(
            out_dir, sketch_name, chip, pid
        )
        if not ok_pick or dest is None or dest_name is None:
            return False, pick_msg or f"Nu am putut alege .bin.\n{log[-400:]}", project

        write_manifest(project, dest_name)
        project["firmwareBin"] = f"firmware/{dest_name}"
        project["firmwareManifest"] = f"firmware/{pid}.manifest.json"
        size_kb = dest.stat().st_size / 1024
        return (
            True,
            f"BIN generat: firmware/{dest_name} ({size_kb:.1f} KB)\n"
            f"Chip: {chip}\nFQBN: {fqbn}\n{pick_msg}",
            project,
        )
