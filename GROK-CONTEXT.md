# Context proiect — pentru Grok pe alt PC

**Repo:** https://github.com/Mihaifl1/iot-proiecte  
**Site live:** https://mihaifl1.github.io/iot-proiecte/  
**Owner:** Mihaifl1 · TikTok-related IoT projects (reproducere, nu „instrucțiuni creator”)

## Ce este

Site static (GitHub Pages) + Manager Python (GUI CustomTkinter):

1. Utilizatorul introduce **numărul proiectului** din video → vede **schemă**, **pași**, **sketch**, eventual **flash USB**.
2. Pe PC, `manager.py` editează proiecte, generează `projects-data.js`, face **push automat pe GitHub**.
3. Tab **Firmware**: **Generează BIN** (arduino-cli) sau **Importă BIN** → `firmware/00X.bin`.
4. Pe site: buton **Încarcă pe ESP** (Chrome/Edge + Web Serial, ESP Web Tools) — panou sus pe pagina proiectului.

## Structură importantă

| Fișier / folder | Rol |
|-----------------|-----|
| `data/projects.json` | Sursă de adevăr proiecte |
| `projects-data.js` | Generat automat — site-ul citește de aici |
| `app.js` | Hub + pagină proiect (hash `#/001`) |
| `flash.js` | Buton flash ESP din browser |
| `manager.py` | GUI: CRUD, Auto GitHub, firmware |
| `bin_builder.py` | Compilare / import `.bin` |
| `firmware/` | `001.bin`, `003.bin` + manifeste |
| `images/` | Scheme foto |
| `.github/workflows/pages.yml` | Deploy GitHub Pages |

## Proiecte (stare tipică)

- **#001** ESP8266 Relay AP — are `firmware/001.bin`, flash pe site OK  
- **#002** ESP32-C3 temp + 2 relee — de obicei **fără** BIN încă (Generează BIN în Manager)  
- **#003** ESP8266 scheduler — are `firmware/003.bin`

## Design / UX decis

- Culori calme (slate/teal), **fără** desene ESP/Arduino pe homepage  
- **Fără** text tip „TikTok: în video scrii… link în bio” pe paginile proiect  
- Site pentru **utilizatori** care vor să **reproducă** proiecte  

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

## Prompt scurt (copiază în Grok pe noul PC)

```
Lucrez la https://github.com/Mihaifl1/iot-proiecte
Citește GROK-CONTEXT.md și README.md din repo.
Site: https://mihaifl1.github.io/iot-proiecte/
Manager: python manager.py (CRUD proiecte, Generează BIN, Auto GitHub).
Flash ESP din browser pe paginile cu firmware/*.bin.
Continuă de aici:
```
