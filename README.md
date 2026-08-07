# Proiecte IoT (TikTok)

Site static: introduci **numărul din video** → schemă + sketch ESP.

## Link public

După activarea GitHub Pages:  
`https://mihaifl1.github.io/iot-proiecte/`

---

## Manager Python (interfață grafică)

Pe PC poți **adăuga, edita și șterge** proiecte din lista de pe pagina principală (și detaliile fiecărei pagini) cu o aplicație grafică.

### Pornire

1. Instalezi o dată dependențele:
   ```text
   pip install -r requirements.txt
   ```
2. Dublu-click pe **`porneste-manager.bat`**  
   sau din terminal:
   ```text
   python manager.py
   ```

### Ce poți face

| Acțiune | Unde |
|--------|------|
| Listă proiecte + căutare | Coloana din stânga |
| **+ Proiect nou** | Buton verde-albastru stânga |
| **Șterge** | Buton roșu (proiectul selectat) |
| Editează titlu, board, tag-uri, TikTok | Tab **Informații** |
| Tabel cablare | Tab **Cablare** |
| Pași numerotați | Tab **Pași** |
| Avertismente | Tab **Avertismente** |
| Cod Arduino / încarcă `.ino` | Tab **Sketch** |
| Poză schemă (se copiază în `images/`) | Tab **Schemă foto** |
| **Salvează** | Scrie `data/projects.json` + `projects-data.js` |
| **Generează site** | Regenerează `projects-data.js` din toate proiectele |
| **Previzualizare** | Deschide `index.html` în browser |

Datele de editare: **`data/projects.json`**.  
Site-ul citește: **`projects-data.js`** (generat automat — nu-l edita manual).

### GitHub automat

În Manager, bifează **Auto GitHub** (implicit ON):

- **+ Proiect nou** → salvează local + `git commit` + `git push`
- **Șterge** → la fel
- **Salvează** / **Generează site** → la fel

Buton **⬆ Push GitHub** = push manual oricând.

Prima dată pe PC trebuie să fii autentificat la GitHub (Credential Manager / PAT / `gh auth login`), altfel push-ul eșuează cu mesaj clar.

---

## Cum modifici pe GitHub (fără PC)

1. Deschide `data/projects.json` (sau `projects-data.js`)
2. Buton creion **Edit**
3. Commit changes → (dacă ai workflow Pages) site-ul se actualizează

## Activare Pages

Settings → Pages → **GitHub Actions** (sau Deploy from branch `main` / root) → Save
