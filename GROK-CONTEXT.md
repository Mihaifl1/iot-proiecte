# Context proiect — pentru Grok pe alt PC

**Repo:** https://github.com/Mihaifl1/iot-proiecte  
**Site live:** https://mihaifl1.github.io/iot-proiecte/ · https://esp-proiecte.md/  
**Owner:** Mihaifl1 · TikTok-related IoT projects (reproducere, nu „instrucțiuni creator”)

## Ce este

Site static (GitHub Pages) + Manager Python (GUI CustomTkinter):

1. Utilizatorul introduce **numărul proiectului** din video → vede **schemă**, **pași**, **sketch**, eventual **flash USB**.
2. Pe PC, `manager.py` editează proiecte, generează `projects-data.js`, face **push automat pe GitHub**.
3. Tab **Firmware**: **Generează BIN** (arduino-cli) sau **Importă BIN** → `firmware/00X.bin`.
4. Pe site: buton **Încarcă pe ESP** + **driver USB** potrivit plăcii (CH340 / CP2102 / CH9102 / USB nativ). Override: câmp `usbChip` în Manager → Firmware.
5. Checkbox **Public pe site** în tab Informații: draft-urile rămân în Manager, **nu** apar pe Pages.

## Structură importantă

| Fișier / folder | Rol |
|-----------------|-----|
| `data/projects.json` | Sursă de adevăr proiecte (inclusiv draft-uri) |
| `projects-data.js` | Generat automat — **doar proiectele publice** |
| `i18n.js` | Limbi site **RO / RU / EN** (selector în antet) |
| `app.js` | Hub + pagină proiect (hash `#/001`) |
| `flash.js` | Buton flash ESP + driver USB după placă |
| `manager.py` | GUI: CRUD, Auto GitHub, firmware, draft/public |
| `bin_builder.py` | Compilare / import `.bin` (preferă `merged.bin` pe ESP32) |
| `firmware/` | `001.bin`–`013.bin` + manifeste (ESP32 = merged 4 MB, flash la offset 0) |
| `images/` | Scheme foto |
| `fritzing/` | Scheme `.fzz` (Fritzing) — buton **Deschide Fritzing** în tab Cablare |
| `.github/workflows/pages.yml` | Deploy GitHub Pages |

## Proiecte (stare)

Toate **#001–#013** sunt publice, au schemă PNG și **BIN** — buton **Încarcă pe ESP** pe site.

- ESP8266: **#001** Relay AP, **#003** Scheduler, **#004** DHT22, **#006** Irigator, **#008** 4 relee, **#010** Scurgere, **#012** Reed
- ESP32-C3 (merged.bin): **#002** Temp + 2 relee, **#005** PIR, **#007** WS2812, **#009** Servo, **#011** OLED+DHT22, **#013** HC-SR04
- **#003**: zilele din UI aliniate cu `tm_wday` (Du=bit0). BIN regenerat la 2026-08-14.

Recompilare: `python _compile_all.py` (sare peste BIN existent) sau `python _compile_all.py --force`.

## Design / UX decis

- Culori calme (slate/teal), **fără** desene ESP/Arduino pe homepage
- **Fără** text tip „TikTok: în video scrii… link în bio” pe paginile proiect
- Site pentru **utilizatori** care vor să **reproducă** proiecte
- Limbi site: **RO / RU / EN** (fără a redesena UI-ul)
- Proiecte incomplete = **draft**, nu se publică

## Comenzi utile

```bash
cd iot-proiecte
pip install -r requirements.txt
python manager.py
# sau: porneste-manager.bat
```

Site: după push, așteaptă deploy Actions → https://mihaifl1.github.io/iot-proiecte/

## Ce să facă Grok pe noul PC

1. Clone / pull: `git clone https://github.com/Mihaifl1/iot-proiecte.git` (sau `git pull`)
2. Citește acest fișier + `README.md`
3. Continuă task-ul utilizatorului **fără** a redesena UI-ul cu icoane mari și **fără** a reintroduce textul tip TikTok pe site
4. La modificări: preferă push pe `main` (Auto GitHub din Manager sau `git push`)
5. Nu publica draft-uri. Nu inventa proiect hardware #004 fără cerere clară.

## Prompt scurt (copiază în Grok pe noul PC)

```
Lucrez la https://github.com/Mihaifl1/iot-proiecte
Citește GROK-CONTEXT.md și README.md din repo.
Site: https://mihaifl1.github.io/iot-proiecte/
Manager: python manager.py (CRUD proiecte, Generează BIN, Auto GitHub, draft/public).
Flash ESP din browser pe paginile cu firmware/*.bin.
Continuă de aici:
```
