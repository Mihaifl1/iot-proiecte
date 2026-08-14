/* Generat automat din data/projects.json — nu edita manual */
window.PROJECTS = [
  {
    "id": "001",
    "title": "ESP8266 Relay – Access Point",
    "short": "ON/OFF releu de pe telefon, fără router",
    "board": "NodeMCU ESP8266",
    "tags": [
      "ESP8266",
      "Releu",
      "AP"
    ],
    "tiktok": "În video scrii: Proiect #001 · Link în bio",
    "sketchName": "ESP8266_Relay_AP.ino",
    "wiring": [
      [
        "ESP8266 (NodeMCU)",
        "Modul Relay"
      ],
      [
        "3.3V sau 5V",
        "VCC"
      ],
      [
        "GND",
        "GND"
      ],
      [
        "D1 (GPIO5)",
        "IN"
      ]
    ],
    "steps": [
      "Arduino IDE → Board: NodeMCU 1.0 (ESP-12E).",
      "Copiază sketch-ul → Upload.",
      "Telefon pe WiFi ESP-Relay (parolă 12345678).",
      "Browser → 192.168.4.1 → ON / OFF."
    ],
    "warnings": [
      "Sarcina 230V pe COM/NO/NC — alimentare separată de ESP.",
      "Nu lega 230V la pinii NodeMCU.",
      "Dacă ON/OFF e invers, schimbă HIGH ↔ LOW."
    ],
    "sketch": "#include <ESP8266WiFi.h>\n#include <ESP8266WebServer.h>\n\nconst char* ssid = \"ESP-Relay\";\nconst char* password = \"12345678\";\n\nESP8266WebServer server(80);\nconst int relayPin = D1;\nbool relayState = false;\n\nvoid handleRoot() {\n  String html = R\"=====(\n<!DOCTYPE html><html><head>\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>ESP Relay</title>\n<style>\nbody{font-family:Arial;text-align:center;background:#111;color:#fff;padding-top:40px}\n.btn{display:inline-block;padding:20px 50px;font-size:24px;margin:20px;border:none;border-radius:12px;color:#fff}\n.on{background:#00c853}.off{background:#d50000}\n</style></head><body>\n<h1>ESP Relay Control</h1>\n<p>Status: <b>)=====\";\n  html += relayState ? \"ON\" : \"OFF\";\n  html += R\"=====(</b></p>\n<a href=\"/on\"><button class=\"btn on\">ON</button></a>\n<a href=\"/off\"><button class=\"btn off\">OFF</button></a>\n</body></html>)=====\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid handleOn() {\n  digitalWrite(relayPin, HIGH);\n  relayState = true;\n  server.sendHeader(\"Location\", \"/\");\n  server.send(303);\n}\n\nvoid handleOff() {\n  digitalWrite(relayPin, LOW);\n  relayState = false;\n  server.sendHeader(\"Location\", \"/\");\n  server.send(303);\n}\n\nvoid setup() {\n  pinMode(relayPin, OUTPUT);\n  digitalWrite(relayPin, LOW);\n  Serial.begin(115200);\n  WiFi.softAP(ssid, password);\n  server.on(\"/\", handleRoot);\n  server.on(\"/on\", handleOn);\n  server.on(\"/off\", handleOff);\n  server.begin();\n}\n\nvoid loop() {\n  server.handleClient();\n}\n",
    "schemaImage": "images/001.png",
    "fritzingFile": "fritzing/001.fzz",
    "chipFamily": "ESP8266",
    "usbChip": "CH340",
    "firmwareBin": "firmware/001.bin",
    "firmwareManifest": "firmware/001.manifest.json",
    "published": true
  },
  {
    "id": "002",
    "title": "ESP32 Temperatură + 2 relee",
    "short": "DS18B20 + 2 relee pe ESP32-C3, web pe AP",
    "board": "ESP32-C3 Super Mini",
    "tags": [
      "ESP32",
      "DS18B20",
      "Releu"
    ],
    "tiktok": "În video scrii: Proiect #002 · Link în bio",
    "sketchName": "esp32c3_temp_relays.ino",
    "wiring": [
      [
        "Componentă",
        "ESP32-C3 Super Mini"
      ],
      [
        "DS18B20 VDD",
        "3V3"
      ],
      [
        "DS18B20 GND",
        "GND"
      ],
      [
        "DS18B20 DATA",
        "GPIO4"
      ],
      [
        "Pull-up 4.7k",
        "DATA ↔ 3V3"
      ],
      [
        "Relay IN1 / IN2",
        "GPIO5 / GPIO6"
      ],
      [
        "Relay VCC / GND",
        "5V / GND"
      ]
    ],
    "steps": [
      "Board: ESP32C3 Dev Module + librării OneWire, DallasTemperature.",
      "Upload sketch → AP ESP32-Temp / 12345678.",
      "Browser pe IP din Serial Monitor."
    ],
    "warnings": [
      "Sarcina pe relee: COM/NO/NC, alimentare separată.",
      "Nu lega 230V la pinii ESP."
    ],
    "sketch": "#include <WiFi.h>\n#include <WebServer.h>\n#include <OneWire.h>\n#include <DallasTemperature.h>\n\nconst char* ap_ssid = \"ESP32-Temp\";\nconst char* ap_pass = \"12345678\";\n#define ONE_WIRE_BUS 4\n#define RELAY1 5\n#define RELAY2 6\n\nOneWire oneWire(ONE_WIRE_BUS);\nDallasTemperature sensors(&oneWire);\nWebServer server(80);\nbool r1 = false, r2 = false;\n\nvoid applyRelays() {\n  digitalWrite(RELAY1, r1 ? HIGH : LOW);\n  digitalWrite(RELAY2, r2 ? HIGH : LOW);\n}\n\nvoid handleRoot() {\n  sensors.requestTemperatures();\n  float t = sensors.getTempCByIndex(0);\n  String html = \"<!DOCTYPE html><html><body style='background:#111;color:#fff;text-align:center;font-family:Arial'>\";\n  html += \"<h2>ESP32 Temp</h2><p>\" + String(t, 1) + \" C</p>\";\n  html += \"<p>R1:\" + String(r1?\"ON\":\"OFF\") + \" R2:\" + String(r2?\"ON\":\"OFF\") + \"</p>\";\n  html += \"<p><a href='/r1on'>R1 ON</a> <a href='/r1off'>R1 OFF</a></p>\";\n  html += \"<p><a href='/r2on'>R2 ON</a> <a href='/r2off'>R2 OFF</a></p></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(RELAY1, OUTPUT);\n  pinMode(RELAY2, OUTPUT);\n  applyRelays();\n  sensors.begin();\n  WiFi.softAP(ap_ssid, ap_pass);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.on(\"/r1on\", []() { r1 = true; applyRelays(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/r1off\", []() { r1 = false; applyRelays(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/r2on\", []() { r2 = true; applyRelays(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/r2off\", []() { r2 = false; applyRelays(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.begin();\n}\n\nvoid loop() { server.handleClient(); }\n",
    "schemaImage": "images/002.png",
    "chipFamily": "ESP32-C3",
    "usbChip": "CDC",
    "firmwareBin": "firmware/002.bin",
    "firmwareManifest": "firmware/002.manifest.json",
    "published": true
  },
  {
    "id": "003",
    "title": "ESP8266 / NodeMCU Smart Scheduler",
    "short": "Programator releu: captive portal, NTP Moldova, până la 12 programe",
    "board": "NodeMCU ESP8266",
    "tags": [
      "ESP8266"
    ],
    "tiktok": "În video scrii: Proiect #003 · Link în bio",
    "sketchName": "ESP8266_WiFi_Scheduler[1].ino",
    "wiring": [
      [
        "Relay",
        "Pin ESP"
      ],
      [
        "vin",
        "3v"
      ],
      [
        "gnd",
        "gnd"
      ],
      [
        "in",
        "d2"
      ]
    ],
    "steps": [
      "Upload sketch pe board."
    ],
    "warnings": [
      "Nu lega 230V la pinii ESP."
    ],
    "sketch": "/*\n * ESP8266 / NodeMCU Smart Scheduler\n * Captive Portal + NTP + Programator inteligent\n *\n * Compatibil: NodeMCU ESP8266, Wemos D1 Mini, etc.\n *\n * Caracteristici:\n * - Access Point + Captive Portal (deschide automat browser-ul)\n * - Configurare WiFi prin pagină web (salvată în LittleFS)\n * - Dashboard modern cu oră NTP live (timezone Moldova)\n * - Până la 12 programe: nume + zile săptămână + start/stop + enable\n * - Control manual override\n * - Totul persistent în LittleFS\n *\n * Hardware: NodeMCU ESP8266 + Releu pe GPIO 4 (D2)\n * Biblioteci: ArduinoJson, LittleFS (inclus în core ESP8266)\n */\n\n#include <ESP8266WiFi.h>\n#include <DNSServer.h>\n#include <ESP8266WebServer.h>\n#include <LittleFS.h>\n#include <ArduinoJson.h>\n#include <time.h>\n\n// ================== CONFIG ==================\nconst char* AP_SSID     = \"ESP-Scheduler\";\nconst char* AP_PASS     = \"12345678\";          // minim 8 caractere\nconst int   RELAY_PIN   = 4;                   // GPIO4 = D2 pe NodeMCU\nconst bool  RELAY_ACTIVE_HIGH = true;          // true = HIGH = ON\nconst int   MAX_PROGRAMS = 12;\nconst char* NTP_SERVER  = \"pool.ntp.org\";\nconst char* TZ_MOLDOVA  = \"EET-2EEST,M3.5.0,M10.5.0/3\";  // Europe/Chisinau\n\n// ================== GLOBALS ==================\nDNSServer dnsServer;\nESP8266WebServer server(80);\n\nbool wifiConnected = false;\nString deviceIP = \"192.168.4.1\";\n\nstruct Program {\n  char name[40];\n  uint8_t days;          // bitmask: bit0=Duminică ... bit6=Sâmbătă\n  uint8_t startH, startM;\n  uint8_t endH, endM;\n  bool enabled;\n};\n\nProgram programs[MAX_PROGRAMS];\nint programCount = 0;\n\nbool manualOverride = false;\nbool manualState = false;\nunsigned long manualUntil = 0;\n\nbool relayState = false;\nunsigned long lastScheduleCheck = 0;\nunsigned long bootMillis = 0;\n\n// ================== HTML PAGES (PROGMEM) ==================\n\nconst char CONFIG_HTML[] PROGMEM = R\"rawliteral(\n<!DOCTYPE html>\n<html lang=\"ro\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Configurare WiFi – ESP Scheduler</title>\n<style>\n:root{--bg:#0f172a;--card:#1e293b;--accent:#38bdf8;--text:#e2e8f0;--muted:#94a3b8;--ok:#22c55e;--err:#ef4444}\n*{box-sizing:border-box;margin:0;padding:0}\nbody{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}\n.card{background:var(--card);border-radius:16px;padding:28px;max-width:420px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.4)}\nh1{font-size:1.4rem;margin-bottom:6px;display:flex;align-items:center;gap:10px}\n.sub{color:var(--muted);font-size:.9rem;margin-bottom:22px}\nlabel{display:block;font-size:.85rem;color:var(--muted);margin:14px 0 6px}\nselect,input[type=password],input[type=text]{width:100%;padding:12px 14px;border-radius:10px;border:1px solid #334155;background:#0f172a;color:var(--text);font-size:1rem}\nbutton{width:100%;margin-top:22px;padding:14px;border:none;border-radius:10px;background:var(--accent);color:#0f172a;font-weight:700;font-size:1rem;cursor:pointer}\nbutton:active{transform:scale(.98)}\n.status{margin-top:16px;padding:12px;border-radius:8px;font-size:.9rem;display:none}\n.ok{background:rgba(34,197,94,.15);color:var(--ok)}\n.err{background:rgba(239,68,68,.15);color:var(--err)}\n.scan-btn{background:transparent;border:1px solid #475569;color:var(--muted);margin-top:10px;padding:10px}\n</style>\n</head>\n<body>\n<div class=\"card\">\n  <h1>📡 Configurare WiFi</h1>\n  <p class=\"sub\">ESP Scheduler (NodeMCU) – alege rețeaua ta</p>\n\n  <label>Rețea WiFi</label>\n  <select id=\"ssid\"></select>\n  <button class=\"scan-btn\" onclick=\"scan()\">🔄 Rescanează rețele</button>\n\n  <label>Parolă</label>\n  <input type=\"password\" id=\"pass\" placeholder=\"Parola rețelei\" autocomplete=\"current-password\">\n\n  <button onclick=\"save()\">Salvează & Conectează</button>\n  <div id=\"status\" class=\"status\"></div>\n</div>\n<script>\nasync function scan(){\n  const sel=document.getElementById('ssid');\n  sel.innerHTML='<option>Scanez...</option>';\n  try{\n    const r=await fetch('/scan');\n    const list=await r.json();\n    sel.innerHTML='';\n    list.forEach(s=>{\n      const o=document.createElement('option');\n      o.value=s.ssid;\n      o.textContent=s.ssid+' ('+s.rssi+' dBm)'+(s.secure?' 🔒':'');\n      sel.appendChild(o);\n    });\n    if(list.length===0) sel.innerHTML='<option value=\"\">Nicio rețea găsită</option>';\n  }catch(e){sel.innerHTML='<option>Eroare scan</option>';}\n}\nasync function save(){\n  const ssid=document.getElementById('ssid').value;\n  const pass=document.getElementById('pass').value;\n  const st=document.getElementById('status');\n  if(!ssid){st.className='status err';st.style.display='block';st.textContent='Alege o rețea';return;}\n  st.className='status';st.style.display='block';st.textContent='Se salvează...';\n  try{\n    const r=await fetch('/savewifi',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},\n      body:'ssid='+encodeURIComponent(ssid)+'&pass='+encodeURIComponent(pass)});\n    const t=await r.text();\n    st.className='status ok';st.textContent=t;\n    setTimeout(()=>location.reload(),2500);\n  }catch(e){st.className='status err';st.textContent='Eroare: '+e;}\n}\nscan();\n</script>\n</body>\n</html>\n)rawliteral\";\n\nconst char MAIN_HTML[] PROGMEM = R\"rawliteral(\n<!DOCTYPE html>\n<html lang=\"ro\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\n<title>ESP Smart Scheduler</title>\n<style>\n:root{--bg:#0b1220;--card:#151e30;--card2:#1c2740;--accent:#38bdf8;--accent2:#818cf8;--text:#f1f5f9;--muted:#94a3b8;--ok:#22c55e;--warn:#f59e0b;--err:#ef4444;--border:#1e293b}\n*{box-sizing:border-box;margin:0;padding:0}\nbody{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;padding-bottom:40px}\nheader{background:linear-gradient(135deg,#0f172a,#1e293b);padding:18px 20px;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50}\n.header-inner{max-width:900px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:12px}\n.logo{font-weight:700;font-size:1.15rem;display:flex;align-items:center;gap:8px}\n.logo span{background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}\n.badge{font-size:.75rem;padding:4px 10px;border-radius:20px;background:rgba(56,189,248,.15);color:var(--accent)}\n.container{max-width:900px;margin:0 auto;padding:16px}\n.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}\n@media(max-width:640px){.grid{grid-template-columns:1fr}}\n.card{background:var(--card);border-radius:14px;padding:18px;border:1px solid var(--border)}\n.card h2{font-size:.95rem;color:var(--muted);font-weight:500;margin-bottom:10px;display:flex;align-items:center;gap:6px}\n.time{font-size:2.1rem;font-weight:700;letter-spacing:-1px;font-variant-numeric:tabular-nums}\n.date{color:var(--muted);font-size:.9rem;margin-top:2px}\n.status-row{display:flex;align-items:center;gap:12px;margin-top:8px}\n.dot{width:12px;height:12px;border-radius:50%}\n.dot.on{background:var(--ok);box-shadow:0 0 12px var(--ok)}\n.dot.off{background:#475569}\n.relay-text{font-size:1.1rem;font-weight:600}\n.reason{font-size:.8rem;color:var(--muted)}\n.btn-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}\nbutton,.btn{border:none;border-radius:9px;padding:10px 14px;font-weight:600;font-size:.88rem;cursor:pointer;transition:.15s}\n.btn-primary{background:var(--accent);color:#0f172a}\n.btn-ok{background:rgba(34,197,94,.2);color:var(--ok);border:1px solid rgba(34,197,94,.3)}\n.btn-warn{background:rgba(245,158,11,.15);color:var(--warn);border:1px solid rgba(245,158,11,.3)}\n.btn-err{background:rgba(239,68,68,.15);color:var(--err);border:1px solid rgba(239,68,68,.3)}\n.btn-ghost{background:var(--card2);color:var(--text);border:1px solid var(--border)}\nbutton:active{transform:scale(.97)}\n.section-title{display:flex;justify-content:space-between;align-items:center;margin:22px 0 12px}\n.section-title h2{font-size:1.1rem}\n.prog-list{display:flex;flex-direction:column;gap:10px}\n.prog{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px 16px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px}\n.prog.disabled{opacity:.55}\n.prog-info h3{font-size:1rem;margin-bottom:4px}\n.prog-meta{font-size:.82rem;color:var(--muted);display:flex;flex-wrap:wrap;gap:8px}\n.days{display:flex;gap:3px;margin-top:6px}\n.day{width:22px;height:22px;border-radius:5px;font-size:.65rem;display:flex;align-items:center;justify-content:center;background:#1e293b;color:#64748b}\n.day.active{background:rgba(56,189,248,.25);color:var(--accent);font-weight:700}\n.prog-actions{display:flex;flex-direction:column;gap:6px}\n.toggle{width:44px;height:24px;border-radius:12px;background:#334155;position:relative;cursor:pointer}\n.toggle.on{background:var(--ok)}\n.toggle::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;left:3px;transition:.2s}\n.toggle.on::after{left:23px}\n.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.65);display:none;align-items:center;justify-content:center;z-index:100;padding:16px}\n.modal-bg.show{display:flex}\n.modal{background:var(--card);border-radius:16px;padding:22px;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;border:1px solid var(--border)}\n.modal h3{margin-bottom:16px;font-size:1.15rem}\n.form-row{margin-bottom:14px}\n.form-row label{display:block;font-size:.82rem;color:var(--muted);margin-bottom:5px}\n.form-row input[type=text],.form-row input[type=time]{width:100%;padding:11px 12px;border-radius:9px;border:1px solid #334155;background:#0f172a;color:var(--text);font-size:1rem}\n.days-select{display:flex;gap:6px;flex-wrap:wrap}\n.days-select label{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:.7rem;color:var(--muted);cursor:pointer}\n.days-select input{width:18px;height:18px;accent-color:var(--accent)}\n.modal-actions{display:flex;gap:10px;margin-top:18px}\n.modal-actions button{flex:1}\n.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:.85rem}\n.info-grid div{background:var(--card2);padding:10px;border-radius:8px}\n.info-grid span{color:var(--muted);display:block;font-size:.75rem}\n.footer{text-align:center;margin-top:30px;color:var(--muted);font-size:.8rem}\n</style>\n</head>\n<body>\n<header>\n  <div class=\"header-inner\">\n    <div class=\"logo\">💧 <span>ESP Scheduler</span></div>\n    <div class=\"badge\" id=\"wifiBadge\">● Conectat</div>\n  </div>\n</header>\n\n<div class=\"container\">\n  <div class=\"grid\">\n    <div class=\"card\">\n      <h2>🕐 Ora curentă (NTP)</h2>\n      <div class=\"time\" id=\"clock\">--:--:--</div>\n      <div class=\"date\" id=\"date\">—</div>\n    </div>\n    <div class=\"card\">\n      <h2>🔌 Status Releu</h2>\n      <div class=\"status-row\">\n        <div class=\"dot\" id=\"relayDot\"></div>\n        <div>\n          <div class=\"relay-text\" id=\"relayText\">—</div>\n          <div class=\"reason\" id=\"relayReason\"></div>\n        </div>\n      </div>\n      <div class=\"btn-row\">\n        <button class=\"btn-ok\" onclick=\"manual(true)\">ON forțat</button>\n        <button class=\"btn-err\" onclick=\"manual(false)\">OFF forțat</button>\n        <button class=\"btn-ghost\" onclick=\"manual(null)\">Auto</button>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"section-title\">\n    <h2>📋 Programe</h2>\n    <button class=\"btn-primary\" onclick=\"openModal()\">＋ Adaugă</button>\n  </div>\n  <div class=\"prog-list\" id=\"progList\"></div>\n\n  <div class=\"section-title\"><h2>⚙️ Sistem</h2></div>\n  <div class=\"card\">\n    <div class=\"info-grid\" id=\"sysInfo\">\n      <div><span>IP</span><b id=\"ip\">—</b></div>\n      <div><span>Uptime</span><b id=\"uptime\">—</b></div>\n      <div><span>Free Heap</span><b id=\"heap\">—</b></div>\n      <div><span>RSSI</span><b id=\"rssi\">—</b></div>\n    </div>\n    <div class=\"btn-row\" style=\"margin-top:14px\">\n      <button class=\"btn-ghost\" onclick=\"location.reload()\">Refresh</button>\n      <button class=\"btn-warn\" onclick=\"reboot()\">Reboot</button>\n      <button class=\"btn-err\" onclick=\"factory()\">Factory Reset</button>\n    </div>\n  </div>\n\n  <div class=\"footer\">ESP8266 Smart Scheduler • NTP + LittleFS • Moldova TZ</div>\n</div>\n\n<!-- Modal Add/Edit -->\n<div class=\"modal-bg\" id=\"modal\">\n  <div class=\"modal\">\n    <h3 id=\"modalTitle\">Program nou</h3>\n    <input type=\"hidden\" id=\"editIdx\" value=\"-1\">\n    <div class=\"form-row\">\n      <label>Nume program</label>\n      <input type=\"text\" id=\"pName\" placeholder=\"ex: Program dimineață\" maxlength=\"36\">\n    </div>\n    <div class=\"form-row\">\n      <label>Zilele săptămânii</label>\n      <div class=\"days-select\" id=\"daysSelect\">\n        <label><input type=\"checkbox\" value=\"2\">Lu</label>\n        <label><input type=\"checkbox\" value=\"4\">Ma</label>\n        <label><input type=\"checkbox\" value=\"8\">Mi</label>\n        <label><input type=\"checkbox\" value=\"16\">Jo</label>\n        <label><input type=\"checkbox\" value=\"32\">Vi</label>\n        <label><input type=\"checkbox\" value=\"64\">Sâ</label>\n        <label><input type=\"checkbox\" value=\"1\">Du</label>\n      </div>\n    </div>\n    <div class=\"form-row\" style=\"display:flex;gap:12px\">\n      <div style=\"flex:1\">\n        <label>Ora start</label>\n        <input type=\"time\" id=\"pStart\" value=\"06:00\">\n      </div>\n      <div style=\"flex:1\">\n        <label>Ora stop</label>\n        <input type=\"time\" id=\"pEnd\" value=\"06:30\">\n      </div>\n    </div>\n    <div class=\"modal-actions\">\n      <button class=\"btn-ghost\" onclick=\"closeModal()\">Anulează</button>\n      <button class=\"btn-primary\" onclick=\"saveProgram()\">Salvează</button>\n    </div>\n  </div>\n</div>\n\n<script>\nconst dayNames=['Du','Lu','Ma','Mi','Jo','Vi','Sâ'];\nlet programs=[];\nlet status={};\n\nasync function api(path,opts){\n  const r=await fetch(path,opts);\n  if(!r.ok) throw new Error(await r.text());\n  return r.json ? r.json() : r.text();\n}\n\nfunction renderClock(){\n  if(!status.epoch) return;\n  const d=new Date((status.epoch+Math.floor((Date.now()-status.clientAt)/1000))*1000);\n  document.getElementById('clock').textContent=d.toLocaleTimeString('ro-RO',{hour12:false});\n  document.getElementById('date').textContent=d.toLocaleDateString('ro-RO',{weekday:'long',day:'numeric',month:'long',year:'numeric'});\n}\n\nfunction renderStatus(){\n  const on=status.relay;\n  document.getElementById('relayDot').className='dot '+(on?'on':'off');\n  document.getElementById('relayText').textContent=on?'PORNIT':'OPRIT';\n  document.getElementById('relayReason').textContent=status.reason||'';\n  document.getElementById('ip').textContent=status.ip||'—';\n  document.getElementById('uptime').textContent=formatUptime(status.uptime||0);\n  document.getElementById('heap').textContent=(status.heap||0)+' B';\n  document.getElementById('rssi').textContent=(status.rssi||0)+' dBm';\n  document.getElementById('wifiBadge').textContent=status.wifi?'● Conectat':'● AP only';\n}\n\nfunction formatUptime(s){\n  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);\n  return h+'h '+m+'m';\n}\n\nfunction renderPrograms(){\n  const list=document.getElementById('progList');\n  if(programs.length===0){\n    list.innerHTML='<div class=\"card\" style=\"text-align:center;color:var(--muted)\">Niciun program. Adaugă primul!</div>';\n    return;\n  }\n  list.innerHTML=programs.map((p,i)=>{\n    let daysHtml='';\n    for(let d=0;d<7;d++){\n      const bit=1<<d;\n      const active=p.days&bit;\n      daysHtml+=`<div class=\"day ${active?'active':''}\">${dayNames[d]}</div>`;\n    }\n    const time=`${pad(p.startH)}:${pad(p.startM)} → ${pad(p.endH)}:${pad(p.endM)}`;\n    return `<div class=\"prog ${p.enabled?'':'disabled'}\">\n      <div class=\"prog-info\">\n        <h3>${esc(p.name)}</h3>\n        <div class=\"prog-meta\"><span>⏰ ${time}</span></div>\n        <div class=\"days\">${daysHtml}</div>\n      </div>\n      <div class=\"prog-actions\">\n        <div class=\"toggle ${p.enabled?'on':''}\" onclick=\"toggleProg(${i})\"></div>\n        <button class=\"btn-ghost\" style=\"padding:6px 10px;font-size:.75rem\" onclick=\"editProg(${i})\">Edit</button>\n        <button class=\"btn-err\" style=\"padding:6px 10px;font-size:.75rem\" onclick=\"delProg(${i})\">Șterge</button>\n      </div>\n    </div>`;\n  }).join('');\n}\n\nfunction pad(n){return n.toString().padStart(2,'0')}\nfunction esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}\n\nasync function refresh(){\n  try{\n    status=await api('/api/status');\n    status.clientAt=Date.now();\n    programs=status.programs||[];\n    renderStatus();\n    renderPrograms();\n    renderClock();\n  }catch(e){console.error(e)}\n}\n\nasync function manual(state){\n  await api('/api/manual',{method:'POST',headers:{'Content-Type':'application/json'},\n    body:JSON.stringify({state:state,minutes:30})});\n  refresh();\n}\n\nfunction openModal(idx=-1){\n  document.getElementById('editIdx').value=idx;\n  document.getElementById('modalTitle').textContent=idx<0?'Program nou':'Editează program';\n  if(idx>=0){\n    const p=programs[idx];\n    document.getElementById('pName').value=p.name;\n    document.getElementById('pStart').value=pad(p.startH)+':'+pad(p.startM);\n    document.getElementById('pEnd').value=pad(p.endH)+':'+pad(p.endM);\n    document.querySelectorAll('#daysSelect input').forEach(cb=>{\n      cb.checked=!!(p.days & parseInt(cb.value));\n    });\n  }else{\n    document.getElementById('pName').value='';\n    document.getElementById('pStart').value='06:00';\n    document.getElementById('pEnd').value='06:30';\n    document.querySelectorAll('#daysSelect input').forEach(cb=>cb.checked=false);\n  }\n  document.getElementById('modal').classList.add('show');\n}\nfunction closeModal(){document.getElementById('modal').classList.remove('show')}\n\nasync function saveProgram(){\n  const idx=parseInt(document.getElementById('editIdx').value);\n  const name=document.getElementById('pName').value.trim()||'Program';\n  let days=0;\n  document.querySelectorAll('#daysSelect input:checked').forEach(cb=>days|=parseInt(cb.value));\n  const [sh,sm]=document.getElementById('pStart').value.split(':').map(Number);\n  const [eh,em]=document.getElementById('pEnd').value.split(':').map(Number);\n  const body={idx,name,days,startH:sh,startM:sm,endH:eh,endM:em,enabled:true};\n  await api('/api/programs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});\n  closeModal();\n  refresh();\n}\n\nasync function toggleProg(i){\n  const p=programs[i];\n  await api('/api/programs',{method:'POST',headers:{'Content-Type':'application/json'},\n    body:JSON.stringify({idx:i,name:p.name,days:p.days,startH:p.startH,startM:p.startM,endH:p.endH,endM:p.endM,enabled:!p.enabled})});\n  refresh();\n}\nasync function editProg(i){openModal(i)}\nasync function delProg(i){\n  if(!confirm('Ștergi programul?')) return;\n  await api('/api/programs?idx='+i,{method:'DELETE'});\n  refresh();\n}\nasync function reboot(){if(confirm('Reboot ESP?')) await api('/api/reboot',{method:'POST'})}\nasync function factory(){if(confirm('Șterge TOATE setările și programele?')) await api('/api/factory',{method:'POST'})}\n\nrefresh();\nsetInterval(refresh,8000);\nsetInterval(renderClock,1000);\n</script>\n</body>\n</html>\n)rawliteral\";\n\n// ================== HELPERS ==================\nvoid setRelay(bool on) {\n  relayState = on;\n  digitalWrite(RELAY_PIN, (RELAY_ACTIVE_HIGH ? on : !on) ? HIGH : LOW);\n}\n\nbool loadWifiCredentials(String &ssid, String &pass) {\n  if (!LittleFS.exists(\"/wifi.json\")) return false;\n  File f = LittleFS.open(\"/wifi.json\", \"r\");\n  if (!f) return false;\n  DynamicJsonDocument doc(256);\n  if (deserializeJson(doc, f)) { f.close(); return false; }\n  f.close();\n  ssid = doc[\"ssid\"] | \"\";\n  pass = doc[\"pass\"] | \"\";\n  return ssid.length() > 0;\n}\n\nvoid saveWifiCredentials(const String &ssid, const String &pass) {\n  DynamicJsonDocument doc(256);\n  doc[\"ssid\"] = ssid;\n  doc[\"pass\"] = pass;\n  File f = LittleFS.open(\"/wifi.json\", \"w\");\n  if (f) {\n    serializeJson(doc, f);\n    f.close();\n  }\n}\n\nvoid loadPrograms() {\n  programCount = 0;\n  if (!LittleFS.exists(\"/programs.json\")) return;\n  File f = LittleFS.open(\"/programs.json\", \"r\");\n  if (!f) return;\n  DynamicJsonDocument doc(4096);\n  if (deserializeJson(doc, f)) { f.close(); return; }\n  f.close();\n  JsonArray arr = doc.as<JsonArray>();\n  for (JsonObject o : arr) {\n    if (programCount >= MAX_PROGRAMS) break;\n    Program &p = programs[programCount];\n    strlcpy(p.name, o[\"name\"] | \"Program\", sizeof(p.name));\n    p.days    = o[\"days\"] | 0;\n    p.startH  = o[\"startH\"] | 0;\n    p.startM  = o[\"startM\"] | 0;\n    p.endH    = o[\"endH\"] | 0;\n    p.endM    = o[\"endM\"] | 0;\n    p.enabled = o[\"enabled\"] | true;\n    programCount++;\n  }\n}\n\nvoid savePrograms() {\n  DynamicJsonDocument doc(4096);\n  JsonArray arr = doc.to<JsonArray>();\n  for (int i = 0; i < programCount; i++) {\n    JsonObject o = arr.createNestedObject();\n    o[\"name\"]    = programs[i].name;\n    o[\"days\"]    = programs[i].days;\n    o[\"startH\"]  = programs[i].startH;\n    o[\"startM\"]  = programs[i].startM;\n    o[\"endH\"]    = programs[i].endH;\n    o[\"endM\"]    = programs[i].endM;\n    o[\"enabled\"] = programs[i].enabled;\n  }\n  File f = LittleFS.open(\"/programs.json\", \"w\");\n  if (f) {\n    serializeJson(doc, f);\n    f.close();\n  }\n}\n\nbool isScheduleActive(const Program &p, int wday, int minutes) {\n  if (!p.enabled) return false;\n  if (!(p.days & (1 << wday))) return false;\n  int start = p.startH * 60 + p.startM;\n  int end   = p.endH * 60 + p.endM;\n  if (end <= start) {\n    return minutes >= start || minutes < end;\n  }\n  return minutes >= start && minutes < end;\n}\n\nvoid updateRelayFromSchedule() {\n  time_t now = time(nullptr);\n  if (now < 100000) {\n    if (!manualOverride) setRelay(false);\n    return;\n  }\n\n  if (manualOverride) {\n    if (millis() < manualUntil) {\n      setRelay(manualState);\n      return;\n    } else {\n      manualOverride = false;\n    }\n  }\n\n  struct tm *ti = localtime(&now);\n  int wday = ti->tm_wday;\n  int minutes = ti->tm_hour * 60 + ti->tm_min;\n\n  bool shouldOn = false;\n  for (int i = 0; i < programCount; i++) {\n    if (isScheduleActive(programs[i], wday, minutes)) {\n      shouldOn = true;\n      break;\n    }\n  }\n  setRelay(shouldOn);\n}\n\nString getReason() {\n  if (manualOverride && millis() < manualUntil) {\n    return manualState ? \"Manual ON\" : \"Manual OFF\";\n  }\n  time_t now = time(nullptr);\n  if (now < 100000) return \"Aștept NTP...\";\n  struct tm *ti = localtime(&now);\n  int wday = ti->tm_wday;\n  int minutes = ti->tm_hour * 60 + ti->tm_min;\n  for (int i = 0; i < programCount; i++) {\n    if (isScheduleActive(programs[i], wday, minutes)) {\n      return String(\"Program: \") + programs[i].name;\n    }\n  }\n  return \"Niciun program activ\";\n}\n\n// ================== HTTP HANDLERS ==================\nvoid handleRoot() {\n  if (wifiConnected) {\n    server.send_P(200, \"text/html\", MAIN_HTML);\n  } else {\n    server.send_P(200, \"text/html\", CONFIG_HTML);\n  }\n}\n\nvoid handleScan() {\n  int n = WiFi.scanNetworks();\n  DynamicJsonDocument doc(2048);\n  JsonArray arr = doc.to<JsonArray>();\n  for (int i = 0; i < n; i++) {\n    JsonObject o = arr.createNestedObject();\n    o[\"ssid\"] = WiFi.SSID(i);\n    o[\"rssi\"] = WiFi.RSSI(i);\n    o[\"secure\"] = WiFi.encryptionType(i) != ENC_TYPE_NONE;\n  }\n  String out;\n  serializeJson(doc, out);\n  server.send(200, \"application/json\", out);\n}\n\nvoid handleSaveWifi() {\n  if (!server.hasArg(\"ssid\")) {\n    server.send(400, \"text/plain\", \"Lipsă SSID\");\n    return;\n  }\n  String ssid = server.arg(\"ssid\");\n  String pass = server.arg(\"pass\");\n  saveWifiCredentials(ssid, pass);\n  server.send(200, \"text/plain\", \"Salvat! Se reconectează...\");\n  delay(500);\n  ESP.restart();\n}\n\nvoid handleApiStatus() {\n  DynamicJsonDocument doc(3072);\n  doc[\"wifi\"] = wifiConnected;\n  doc[\"ip\"] = deviceIP;\n  doc[\"relay\"] = relayState;\n  doc[\"reason\"] = getReason();\n  doc[\"uptime\"] = (millis() - bootMillis) / 1000;\n  doc[\"heap\"] = ESP.getFreeHeap();\n  doc[\"rssi\"] = WiFi.RSSI();\n  time_t now = time(nullptr);\n  doc[\"epoch\"] = (now > 100000) ? now : 0;\n\n  JsonArray arr = doc.createNestedArray(\"programs\");\n  for (int i = 0; i < programCount; i++) {\n    JsonObject o = arr.createNestedObject();\n    o[\"name\"]    = programs[i].name;\n    o[\"days\"]    = programs[i].days;\n    o[\"startH\"]  = programs[i].startH;\n    o[\"startM\"]  = programs[i].startM;\n    o[\"endH\"]    = programs[i].endH;\n    o[\"endM\"]    = programs[i].endM;\n    o[\"enabled\"] = programs[i].enabled;\n  }\n\n  String out;\n  serializeJson(doc, out);\n  server.send(200, \"application/json\", out);\n}\n\nvoid handleApiPrograms() {\n  if (server.method() == HTTP_DELETE) {\n    int idx = server.arg(\"idx\").toInt();\n    if (idx >= 0 && idx < programCount) {\n      for (int i = idx; i < programCount - 1; i++) programs[i] = programs[i + 1];\n      programCount--;\n      savePrograms();\n    }\n    server.send(200, \"application/json\", \"{\\\"ok\\\":true}\");\n    return;\n  }\n\n  String body = server.arg(\"plain\");\n  DynamicJsonDocument doc(512);\n  if (deserializeJson(doc, body)) {\n    server.send(400, \"text/plain\", \"JSON invalid\");\n    return;\n  }\n  int idx = doc[\"idx\"] | -1;\n  if (idx >= 0 && idx < programCount) {\n    Program &p = programs[idx];\n    strlcpy(p.name, doc[\"name\"] | \"Program\", sizeof(p.name));\n    p.days    = doc[\"days\"] | 0;\n    p.startH  = doc[\"startH\"] | 0;\n    p.startM  = doc[\"startM\"] | 0;\n    p.endH    = doc[\"endH\"] | 0;\n    p.endM    = doc[\"endM\"] | 0;\n    p.enabled = doc[\"enabled\"] | true;\n  } else {\n    if (programCount >= MAX_PROGRAMS) {\n      server.send(400, \"text/plain\", \"Maxim 12 programe\");\n      return;\n    }\n    Program &p = programs[programCount];\n    strlcpy(p.name, doc[\"name\"] | \"Program\", sizeof(p.name));\n    p.days    = doc[\"days\"] | 0;\n    p.startH  = doc[\"startH\"] | 0;\n    p.startM  = doc[\"startM\"] | 0;\n    p.endH    = doc[\"endH\"] | 0;\n    p.endM    = doc[\"endM\"] | 0;\n    p.enabled = doc[\"enabled\"] | true;\n    programCount++;\n  }\n  savePrograms();\n  server.send(200, \"application/json\", \"{\\\"ok\\\":true}\");\n}\n\nvoid handleApiManual() {\n  String body = server.arg(\"plain\");\n  DynamicJsonDocument doc(256);\n  deserializeJson(doc, body);\n  if (doc[\"state\"].isNull()) {\n    manualOverride = false;\n  } else {\n    manualOverride = true;\n    manualState = doc[\"state\"];\n    int minutes = doc[\"minutes\"] | 30;\n    manualUntil = millis() + (unsigned long)minutes * 60000UL;\n  }\n  updateRelayFromSchedule();\n  server.send(200, \"application/json\", \"{\\\"ok\\\":true}\");\n}\n\nvoid handleApiReboot() {\n  server.send(200, \"application/json\", \"{\\\"ok\\\":true}\");\n  delay(300);\n  ESP.restart();\n}\n\nvoid handleApiFactory() {\n  LittleFS.remove(\"/wifi.json\");\n  LittleFS.remove(\"/programs.json\");\n  server.send(200, \"application/json\", \"{\\\"ok\\\":true}\");\n  delay(300);\n  ESP.restart();\n}\n\nvoid handleNotFound() {\n  if (!wifiConnected) {\n    server.sendHeader(\"Location\", String(\"http://\") + WiFi.softAPIP().toString(), true);\n    server.send(302, \"text/plain\", \"\");\n  } else {\n    server.send(404, \"text/plain\", \"Not found\");\n  }\n}\n\n// ================== SETUP & LOOP ==================\nvoid setup() {\n  Serial.begin(115200);\n  delay(200);\n  bootMillis = millis();\n\n  pinMode(RELAY_PIN, OUTPUT);\n  setRelay(false);\n\n  // LittleFS\n  if (!LittleFS.begin()) {\n    Serial.println(\"LittleFS mount failed – formatting...\");\n    LittleFS.format();\n    LittleFS.begin();\n  }\n\n  loadPrograms();\n\n  // Start AP always\n  WiFi.mode(WIFI_AP_STA);\n  WiFi.softAP(AP_SSID, AP_PASS);\n  delay(100);\n  IPAddress apIP = WiFi.softAPIP();\n  Serial.print(\"AP IP: \");\n  Serial.println(apIP);\n\n  // Try connect to saved WiFi\n  String ssid, pass;\n  if (loadWifiCredentials(ssid, pass)) {\n    Serial.printf(\"Connecting to %s ...\\n\", ssid.c_str());\n    WiFi.begin(ssid.c_str(), pass.c_str());\n    unsigned long start = millis();\n    while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {\n      delay(400);\n      Serial.print(\".\");\n    }\n    Serial.println();\n    if (WiFi.status() == WL_CONNECTED) {\n      wifiConnected = true;\n      deviceIP = WiFi.localIP().toString();\n      Serial.print(\"Connected! IP: \");\n      Serial.println(deviceIP);\n\n      configTime(0, 0, NTP_SERVER, \"time.nist.gov\");\n      setenv(\"TZ\", TZ_MOLDOVA, 1);\n      tzset();\n      Serial.println(\"NTP started (Europe/Chisinau)\");\n    } else {\n      Serial.println(\"WiFi connect failed – rămân în AP mode\");\n    }\n  } else {\n    Serial.println(\"Nicio credențială WiFi salvată\");\n  }\n\n  // DNS for captive portal\n  dnsServer.start(53, \"*\", apIP);\n\n  // Routes\n  server.on(\"/\", handleRoot);\n  server.on(\"/scan\", handleScan);\n  server.on(\"/savewifi\", HTTP_POST, handleSaveWifi);\n  server.on(\"/api/status\", handleApiStatus);\n  server.on(\"/api/programs\", HTTP_ANY, handleApiPrograms);\n  server.on(\"/api/manual\", HTTP_POST, handleApiManual);\n  server.on(\"/api/reboot\", HTTP_POST, handleApiReboot);\n  server.on(\"/api/factory\", HTTP_POST, handleApiFactory);\n  server.onNotFound(handleNotFound);\n\n  server.begin();\n  Serial.println(\"HTTP server started\");\n  Serial.println(\"Conectează-te la WiFi: ESP-Scheduler / 12345678\");\n  Serial.println(\"Board: NodeMCU ESP8266\");\n}\n\nvoid loop() {\n  dnsServer.processNextRequest();\n  server.handleClient();\n\n  static unsigned long lastWifiCheck = 0;\n  if (millis() - lastWifiCheck > 10000) {\n    lastWifiCheck = millis();\n    bool nowConnected = (WiFi.status() == WL_CONNECTED);\n    if (nowConnected != wifiConnected) {\n      wifiConnected = nowConnected;\n      if (wifiConnected) {\n        deviceIP = WiFi.localIP().toString();\n        configTime(0, 0, NTP_SERVER);\n        setenv(\"TZ\", TZ_MOLDOVA, 1);\n        tzset();\n      }\n    }\n  }\n\n  if (millis() - lastScheduleCheck > 15000) {\n    lastScheduleCheck = millis();\n    updateRelayFromSchedule();\n  }\n}\n",
    "schemaImage": "images/003.png",
    "chipFamily": "ESP8266",
    "usbChip": "CH340",
    "firmwareBin": "firmware/003.bin",
    "firmwareManifest": "firmware/003.manifest.json",
    "published": true
  },
  {
    "tiktok": "În video scrii: Proiect #004 · Link în bio",
    "schemaImage": "images/004.png",
    "firmwareBin": "firmware/004.bin",
    "firmwareManifest": "firmware/004.manifest.json",
    "published": true,
    "id": "004",
    "title": "ESP8266 Termometru DHT22",
    "short": "Temperatură + umiditate pe telefon, fără router",
    "board": "NodeMCU ESP8266",
    "tags": [
      "ESP8266",
      "DHT22",
      "AP"
    ],
    "sketchName": "ESP8266_DHT22_AP.ino",
    "chipFamily": "ESP8266",
    "usbChip": "CH340",
    "wiring": [
      [
        "Componentă",
        "Pin ESP"
      ],
      [
        "DHT22 VCC",
        "3V3"
      ],
      [
        "DHT22 GND",
        "GND"
      ],
      [
        "DHT22 DATA",
        "D4 (GPIO2)"
      ],
      [
        "Pull-up 4.7k (dacă lipsește pe modul)",
        "DATA ↔ 3V3"
      ]
    ],
    "steps": [
      "Arduino IDE → Board: NodeMCU 1.0 + librăria DHT sensor library (Adafruit).",
      "Upload sketch → WiFi ESP-DHT / 12345678.",
      "Browser → 192.168.4.1 — se reîmprospătează la 5 s."
    ],
    "warnings": [
      "DHT22 e 3.3–5 V; pe NodeMCU folosește 3V3.",
      "Nu lega 230V la pinii ESP."
    ],
    "sketch": "#include <ESP8266WiFi.h>\n#include <ESP8266WebServer.h>\n#include <DHT.h>\n\nconst char* ssid = \"ESP-DHT\";\nconst char* password = \"12345678\";\n#define DHTPIN D4\n#define DHTTYPE DHT22\nDHT dht(DHTPIN, DHTTYPE);\nESP8266WebServer server(80);\n\nvoid handleRoot() {\n  float t = dht.readTemperature();\n  float h = dht.readHumidity();\n  String html = \"<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<meta http-equiv='refresh' content='5'><title>DHT22</title></head>\";\n  html += \"<body style='background:#111;color:#eee;font-family:sans-serif;text-align:center;padding:32px'>\";\n  html += \"<h1>ESP DHT22</h1>\";\n  if (isnan(t) || isnan(h)) html += \"<p>Senzor indisponibil</p>\";\n  else {\n    html += \"<p style='font-size:2rem'>\" + String(t, 1) + \" &deg;C</p>\";\n    html += \"<p>Umiditate: \" + String(h, 0) + \" %</p>\";\n  }\n  html += \"</body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  dht.begin();\n  WiFi.softAP(ssid, password);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.begin();\n}\nvoid loop() { server.handleClient(); }\n"
  },
  {
    "tiktok": "În video scrii: Proiect #005 · Link în bio",
    "schemaImage": "images/005.png",
    "firmwareBin": "firmware/005.bin",
    "firmwareManifest": "firmware/005.manifest.json",
    "published": true,
    "id": "005",
    "title": "ESP32-C3 Alarmă PIR",
    "short": "Mișcare + buzzer, armare din telefon pe AP",
    "board": "ESP32-C3 Super Mini",
    "tags": [
      "ESP32",
      "PIR",
      "Alarmă"
    ],
    "sketchName": "esp32c3_pir_alarm.ino",
    "chipFamily": "ESP32-C3",
    "usbChip": "CDC",
    "wiring": [
      [
        "Componentă",
        "ESP32-C3 Super Mini"
      ],
      [
        "PIR VCC",
        "5V sau 3V3 (după modul)"
      ],
      [
        "PIR GND",
        "GND"
      ],
      [
        "PIR OUT",
        "GPIO4"
      ],
      [
        "Buzzer +",
        "GPIO5"
      ],
      [
        "Buzzer −",
        "GND"
      ]
    ],
    "steps": [
      "Board: ESP32C3 Dev Module.",
      "Upload → AP ESP-PIR / 12345678 → 192.168.4.1.",
      "Armează / dezarmează din pagină. PIR-ul are ~30 s încălzire."
    ],
    "warnings": [
      "Modulele PIR HC-SR501 preferă 5 V pe VCC.",
      "Nu ține buzzerul pe un pin 3.3 V dacă e foarte consumator — folosește buzzer activ mic."
    ],
    "sketch": "#include <WiFi.h>\n#include <WebServer.h>\n\nconst char* ap_ssid = \"ESP-PIR\";\nconst char* ap_pass = \"12345678\";\n#define PIR_PIN 4\n#define BUZZ_PIN 5\nWebServer server(80);\nbool armed = true;\nbool motion = false;\n\nvoid handleRoot() {\n  String html = \"<!DOCTYPE html><html><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<meta http-equiv='refresh' content='2'><body style='background:#111;color:#eee;text-align:center;font-family:sans-serif;padding:28px'>\";\n  html += \"<h1>Alarma PIR</h1><p>Miscare: <b>\";\n  html += motion ? \"DA\" : \"nu\";\n  html += \"</b></p><p>Armata: \";\n  html += armed ? \"DA\" : \"nu\";\n  html += \"</p><p><a href='/arm'>Armeaza</a> &nbsp; <a href='/disarm'>Dezarmeaza</a></p></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(PIR_PIN, INPUT);\n  pinMode(BUZZ_PIN, OUTPUT);\n  digitalWrite(BUZZ_PIN, LOW);\n  WiFi.softAP(ap_ssid, ap_pass);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.on(\"/arm\", []() { armed = true; server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/disarm\", []() { armed = false; digitalWrite(BUZZ_PIN, LOW); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.begin();\n}\nvoid loop() {\n  motion = digitalRead(PIR_PIN) == HIGH;\n  digitalWrite(BUZZ_PIN, (armed && motion) ? HIGH : LOW);\n  server.handleClient();\n}\n"
  },
  {
    "tiktok": "În video scrii: Proiect #006 · Link în bio",
    "schemaImage": "images/006.png",
    "firmwareBin": "firmware/006.bin",
    "firmwareManifest": "firmware/006.manifest.json",
    "published": true,
    "id": "006",
    "title": "ESP8266 Irigator plante",
    "short": "Senzor de sol + pompă/releu, control web",
    "board": "NodeMCU ESP8266",
    "tags": [
      "ESP8266",
      "Sol",
      "Releu"
    ],
    "sketchName": "ESP8266_Plant.ino",
    "chipFamily": "ESP8266",
    "usbChip": "CH340",
    "wiring": [
      [
        "Componentă",
        "Pin ESP"
      ],
      [
        "Senzor sol VCC",
        "3V3"
      ],
      [
        "Senzor sol GND",
        "GND"
      ],
      [
        "Senzor sol AO",
        "A0"
      ],
      [
        "Relay IN",
        "D1 (GPIO5)"
      ],
      [
        "Relay VCC / GND",
        "5V / GND"
      ]
    ],
    "steps": [
      "Upload sketch → AP ESP-Plant / 12345678.",
      "Browser 192.168.4.1 — vezi valoarea analogică și pornești pompa.",
      "Calibrează: aer (uscat) vs. apă; apoi decizi pragul."
    ],
    "warnings": [
      "Sarcina pe relee: COM/NO/NC, alimentare separată.",
      "Pompa 12 V / 230 V doar pe contactele releului, nu pe ESP.",
      "Nu lega 230V la pinii ESP."
    ],
    "sketch": "#include <ESP8266WiFi.h>\n#include <ESP8266WebServer.h>\n\nconst char* ssid = \"ESP-Plant\";\nconst char* password = \"12345678\";\n#define SOIL_PIN A0\n#define RELAY_PIN D1\nESP8266WebServer server(80);\nint threshold = 500;\nbool pump = false;\n\nvoid applyPump() { digitalWrite(RELAY_PIN, pump ? HIGH : LOW); }\n\nvoid handleRoot() {\n  int soil = analogRead(SOIL_PIN);\n  String html = \"<!DOCTYPE html><html><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<meta http-equiv='refresh' content='4'><body style='background:#111;color:#eee;text-align:center;font-family:sans-serif;padding:28px'>\";\n  html += \"<h1>Ir<fim-middle>igator</h1><p>Sol (0 uscat - 1024 umed): <b>\" + String(soil) + \"</b></p>\";\n  html += \"<p>Pompa: \" + String(pump ? \"ON\" : \"OFF\") + \"</p>\";\n  html += \"<p><a href='/on'>ON</a> &nbsp; <a href='/off'>OFF</a></p></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(RELAY_PIN, OUTPUT);\n  applyPump();\n  WiFi.softAP(ssid, password);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.on(\"/on\", []() { pump = true; applyPump(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/off\", []() { pump = false; applyPump(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.begin();\n}\nvoid loop() { server.handleClient(); }\n"
  },
  {
    "tiktok": "În video scrii: Proiect #007 · Link în bio",
    "schemaImage": "images/007.png",
    "firmwareBin": "firmware/007.bin",
    "firmwareManifest": "firmware/007.manifest.json",
    "published": true,
    "id": "007",
    "title": "ESP32 Bandă LED WS2812",
    "short": "Culoare RGB din browser, 8 LED-uri pe AP",
    "board": "ESP32-C3 Super Mini",
    "tags": [
      "ESP32",
      "WS2812",
      "LED"
    ],
    "sketchName": "esp32_ws2812.ino",
    "chipFamily": "ESP32-C3",
    "usbChip": "CDC",
    "wiring": [
      [
        "Componentă",
        "ESP32-C3 Super Mini"
      ],
      [
        "WS2812 5V",
        "5V (sau 3V3 la 1–8 LED-uri)"
      ],
      [
        "WS2812 GND",
        "GND"
      ],
      [
        "WS2812 DIN",
        "GPIO4"
      ]
    ],
    "steps": [
      "Librărie Adafruit NeoPixel.",
      "Upload → AP ESP-RGB / 12345678 → 192.168.4.1.",
      "Glisează R/G/B și apasă Setează."
    ],
    "warnings": [
      "GND comun ESP + bandă. La multe LED-uri alimentează banda separat de 5 V."
    ],
    "sketch": "#include <WiFi.h>\n#include <WebServer.h>\n#include <Adafruit_NeoPixel.h>\n\nconst char* ap_ssid = \"ESP-RGB\";\nconst char* ap_pass = \"12345678\";\n#define LED_PIN 4\n#define LED_COUNT 8\nAdafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);\nWebServer server(80);\nuint8_t cr = 0, cg = 40, cb = 80;\n\nvoid showColor() {\n  for (int i = 0; i < LED_COUNT; i++) strip.setPixelColor(i, strip.Color(cr, cg, cb));\n  strip.show();\n}\n\nvoid handleRoot() {\n  if (server.hasArg(\"r\")) cr = server.arg(\"r\").toInt();\n  if (server.hasArg(\"g\")) cg = server.arg(\"g\").toInt();\n  if (server.hasArg(\"b\")) cb = server.arg(\"b\").toInt();\n  showColor();\n  String html = \"<!DOCTYPE html><html><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<body style='background:#111;color:#eee;text-align:center;font-family:sans-serif;padding:24px'>\";\n  html += \"<h1>WS2812</h1><form><p>R <input type='range' name='r' min='0' max='255' value='\" + String(cr) + \"'></p>\";\n  html += \"<p>G <input type='range' name='g' min='0' max='255' value='\" + String(cg) + \"'></p>\";\n  html += \"<p>B <input type='range' name='b' min='0' max='255' value='\" + String(cb) + \"'></p>\";\n  html += \"<button>Seteaza</button></form></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  strip.begin();\n  showColor();\n  WiFi.softAP(ap_ssid, ap_pass);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.begin();\n}\nvoid loop() { server.handleClient(); }\n"
  },
  {
    "tiktok": "În video scrii: Proiect #008 · Link în bio",
    "schemaImage": "images/008.png",
    "firmwareBin": "firmware/008.bin",
    "firmwareManifest": "firmware/008.manifest.json",
    "published": true,
    "id": "008",
    "title": "ESP8266 Panou 4 relee",
    "short": "Patru ieșiri ON/OFF de pe telefon, AP",
    "board": "NodeMCU ESP8266",
    "tags": [
      "ESP8266",
      "Releu",
      "AP"
    ],
    "sketchName": "ESP8266_4Relay.ino",
    "chipFamily": "ESP8266",
    "usbChip": "CH340",
    "wiring": [
      [
        "Componentă",
        "Pin ESP"
      ],
      [
        "Relay IN1 / IN2 / IN3 / IN4",
        "D1 / D2 / D5 / D6"
      ],
      [
        "Relay VCC",
        "5V"
      ],
      [
        "Relay GND",
        "GND"
      ]
    ],
    "steps": [
      "Upload → AP ESP-4Relay / 12345678.",
      "192.168.4.1 — ON/OFF pe fiecare canal.",
      "Dacă logica e inversă, schimbă HIGH ↔ LOW în sketch."
    ],
    "warnings": [
      "Sarcina pe relee: COM/NO/NC, alimentare separată.",
      "Nu lega 230V la pinii ESP."
    ],
    "sketch": "#include <ESP8266WiFi.h>\n#include <ESP8266WebServer.h>\n\nconst char* ssid = \"ESP-4Relay\";\nconst char* password = \"12345678\";\nconst int pins[4] = {D1, D2, D5, D6};\nbool st[4] = {false, false, false, false};\nESP8266WebServer server(80);\n\nvoid apply() {\n  for (int i = 0; i < 4; i++) digitalWrite(pins[i], st[i] ? HIGH : LOW);\n}\n\nvoid handleRoot() {\n  String html = \"<!DOCTYPE html><html><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<body style='background:#111;color:#eee;text-align:center;font-family:sans-serif;padding:24px'><h1>4 relee</h1>\";\n  for (int i = 0; i < 4; i++) {\n    html += \"<p>R\" + String(i + 1) + \": <b>\" + String(st[i] ? \"ON\" : \"OFF\") + \"</b> \";\n    html += \"<a href='/on?ch=\" + String(i) + \"'>ON</a> \";\n    html += \"<a href='/off?ch=\" + String(i) + \"'>OFF</a></p>\";\n  }\n  html += \"</body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setCh(bool on) {\n  int ch = server.hasArg(\"ch\") ? server.arg(\"ch\").toInt() : -1;\n  if (ch >= 0 && ch < 4) st[ch] = on;\n  apply();\n  server.sendHeader(\"Location\", \"/\");\n  server.send(303);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  for (int i = 0; i < 4; i++) { pinMode(pins[i], OUTPUT); }\n  apply();\n  WiFi.softAP(ssid, password);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.on(\"/on\", []() { setCh(true); });\n  server.on(\"/off\", []() { setCh(false); });\n  server.begin();\n}\nvoid loop() { server.handleClient(); }\n"
  },
  {
    "tiktok": "În video scrii: Proiect #009 · Link în bio",
    "schemaImage": "images/009.png",
    "firmwareBin": "firmware/009.bin",
    "firmwareManifest": "firmware/009.manifest.json",
    "published": true,
    "id": "009",
    "title": "ESP32-C3 Servomotor web",
    "short": "Unghi 0–180° din telefon, fără router",
    "board": "ESP32-C3 Super Mini",
    "tags": [
      "ESP32",
      "Servo"
    ],
    "sketchName": "esp32c3_servo.ino",
    "chipFamily": "ESP32-C3",
    "usbChip": "CDC",
    "wiring": [
      [
        "Componentă",
        "ESP32-C3 Super Mini"
      ],
      [
        "Servo 5V (roșu)",
        "5V (alimentare externă recomandată)"
      ],
      [
        "Servo GND (maro/negru)",
        "GND comun"
      ],
      [
        "Servo PWM (portocaliu)",
        "GPIO4"
      ]
    ],
    "steps": [
      "Librărie ESP32Servo.",
      "Upload → AP ESP-Servo / 12345678 → 192.168.4.1.",
      "Glisează unghiul sau apasă 0 / 90 / 180."
    ],
    "warnings": [
      "Servo-ul trage curent la mișcare — GND comun, 5 V separat dacă tresare ESP-ul."
    ],
    "sketch": "#include <WiFi.h>\n#include <WebServer.h>\n#include <ESP32Servo.h>\n\nconst char* ap_ssid = \"ESP-Servo\";\nconst char* ap_pass = \"12345678\";\n#define SERVO_PIN 4\nServo s;\nWebServer server(80);\nint angle = 90;\n\nvoid handleRoot() {\n  if (server.hasArg(\"a\")) {\n    angle = constrain(server.arg(\"a\").toInt(), 0, 180);\n    s.write(angle);\n  }\n  String html = \"<!DOCTYPE html><html><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<body style='background:#111;color:#eee;text-align:center;font-family:sans-serif;padding:24px'>\";\n  html += \"<h1>Servo</h1><p>Unghi: \" + String(angle) + \"&deg;</p>\";\n  html += \"<form><input type='range' name='a' min='0' max='180' value='\" + String(angle) + \"'>\";\n  html += \"<p><button>Seteaza</button></p></form>\";\n  html += \"<p><a href='/?a=0'>0</a> &nbsp; <a href='/?a=90'>90</a> &nbsp; <a href='/?a=180'>180</a></p></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  s.setPeriodHertz(50);\n  s.attach(SERVO_PIN, 500, 2400);\n  s.write(angle);\n  WiFi.softAP(ap_ssid, ap_pass);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.begin();\n}\nvoid loop() { server.handleClient(); }\n"
  },
  {
    "tiktok": "În video scrii: Proiect #010 · Link în bio",
    "schemaImage": "images/010.png",
    "firmwareBin": "firmware/010.bin",
    "firmwareManifest": "firmware/010.manifest.json",
    "published": true,
    "id": "010",
    "title": "ESP8266 Alarmă scurgere apă",
    "short": "Senzor de lichid + buzzer, stare pe web",
    "board": "NodeMCU ESP8266",
    "tags": [
      "ESP8266",
      "Apă",
      "Alarmă"
    ],
    "sketchName": "ESP8266_Leak.ino",
    "chipFamily": "ESP8266",
    "usbChip": "CH340",
    "wiring": [
      [
        "Componentă",
        "Pin ESP"
      ],
      [
        "Senzor scurgere VCC",
        "3V3"
      ],
      [
        "Senzor scurgere GND",
        "GND"
      ],
      [
        "Senzor DO (digital)",
        "D5"
      ],
      [
        "Buzzer +",
        "D6"
      ],
      [
        "Buzzer −",
        "GND"
      ]
    ],
    "steps": [
      "Upload → AP ESP-Leak / 12345678.",
      "192.168.4.1 se reîmprospătează singur.",
      "Mute oprește sunetul; senzorul e activ LOW când e umed."
    ],
    "warnings": [
      "Ține electronica departe de apă. Doar sonda/senzorul stă jos.",
      "Nu lega 230V la pinii ESP."
    ],
    "sketch": "#include <ESP8266WiFi.h>\n#include <ESP8266WebServer.h>\n\nconst char* ssid = \"ESP-Leak\";\nconst char* password = \"12345678\";\n#define LEAK_PIN D5\n#define BUZZ_PIN D6\nESP8266WebServer server(80);\nbool mute = false;\n\nvoid handleRoot() {\n  bool wet = digitalRead(LEAK_PIN) == LOW;\n  String html = \"<!DOCTYPE html><html><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<meta http-equiv='refresh' content='2'><body style='background:#111;color:#eee;text-align:center;font-family:sans-serif;padding:28px'>\";\n  html += \"<h1>Scurgere apa</h1><p style='font-size:1.4rem'>\";\n  html += wet ? \"<b style='color:#f66'>Umed / ALARMA</b>\" : \"Uscat\";\n  html += \"</p><p><a href='/mute'>Mute</a> &nbsp; <a href='/unmute'>Sunet</a></p></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(LEAK_PIN, INPUT_PULLUP);\n  pinMode(BUZZ_PIN, OUTPUT);\n  digitalWrite(BUZZ_PIN, LOW);\n  WiFi.softAP(ssid, password);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.on(\"/mute\", []() { mute = true; digitalWrite(BUZZ_PIN, LOW); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/unmute\", []() { mute = false; server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.begin();\n}\nvoid loop() {\n  bool wet = digitalRead(LEAK_PIN) == LOW;\n  digitalWrite(BUZZ_PIN, (!mute && wet) ? HIGH : LOW);\n  server.handleClient();\n}\n"
  },
  {
    "tiktok": "În video scrii: Proiect #011 · Link în bio",
    "schemaImage": "images/011.png",
    "firmwareBin": "firmware/011.bin",
    "firmwareManifest": "firmware/011.manifest.json",
    "published": true,
    "id": "011",
    "title": "ESP32 Meteo OLED + DHT22",
    "short": "Temperatură pe ecran 0.96\" și pe telefon",
    "board": "ESP32-C3 Super Mini",
    "tags": [
      "ESP32",
      "OLED",
      "DHT22"
    ],
    "sketchName": "esp32_oled_dht.ino",
    "chipFamily": "ESP32-C3",
    "usbChip": "CDC",
    "wiring": [
      [
        "Componentă",
        "ESP32-C3 Super Mini"
      ],
      [
        "OLED VCC / GND",
        "3V3 / GND"
      ],
      [
        "OLED SDA / SCL",
        "GPIO8 / GPIO9"
      ],
      [
        "DHT22 VCC / GND / DATA",
        "3V3 / GND / GPIO4"
      ]
    ],
    "steps": [
      "Librării: DHT, Adafruit SSD1306, Adafruit GFX.",
      "Upload → AP ESP-Meteo / 12345678.",
      "OLED-ul arată valorile; pagina web la 192.168.4.1."
    ],
    "warnings": [
      "Dacă ecranul e negru, adresa I2C poate fi 0x3D în loc de 0x3C."
    ],
    "sketch": "#include <WiFi.h>\n#include <WebServer.h>\n#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n#include <DHT.h>\n\nconst char* ap_ssid = \"ESP-Meteo\";\nconst char* ap_pass = \"12345678\";\n#define DHTPIN 4\n#define DHTTYPE DHT22\n#define SDA_PIN 8\n#define SCL_PIN 9\nDHT dht(DHTPIN, DHTTYPE);\nAdafruit_SSD1306 display(128, 64, &Wire, -1);\nWebServer server(80);\nfloat t = NAN, h = NAN;\n\nvoid draw() {\n  display.clearDisplay();\n  display.setTextColor(SSD1306_WHITE);\n  display.setTextSize(1);\n  display.setCursor(0, 0);\n  display.println(\"ESP32 Meteo\");\n  display.setTextSize(2);\n  display.setCursor(0, 20);\n  if (isnan(t)) display.println(\"-- C\");\n  else { display.print(t, 1); display.println(\" C\"); }\n  display.setTextSize(1);\n  display.setCursor(0, 50);\n  if (isnan(h)) display.println(\"H: -- %\");\n  else { display.print(\"H: \"); display.print(h, 0); display.println(\" %\"); }\n  display.display();\n}\n\nvoid handleRoot() {\n  String html = \"<!DOCTYPE html><html><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<meta http-equiv='refresh' content='5'><body style='background:#111;color:#eee;text-align:center;font-family:sans-serif;padding:28px'>\";\n  html += \"<h1>Meteo OLED</h1><p>\" + (isnan(t) ? String(\"--\") : String(t, 1)) + \" C</p>\";\n  html += \"<p>Umiditate \" + (isnan(h) ? String(\"--\") : String(h, 0)) + \" %</p></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  Wire.begin(SDA_PIN, SCL_PIN);\n  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);\n  dht.begin();\n  WiFi.softAP(ap_ssid, ap_pass);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.begin();\n  draw();\n}\nvoid loop() {\n  static unsigned long last = 0;\n  if (millis() - last > 3000) {\n    last = millis();\n    t = dht.readTemperature();\n    h = dht.readHumidity();\n    draw();\n  }\n  server.handleClient();\n}\n"
  },
  {
    "tiktok": "În video scrii: Proiect #012 · Link în bio",
    "schemaImage": "images/012.png",
    "firmwareBin": "firmware/012.bin",
    "firmwareManifest": "firmware/012.manifest.json",
    "published": true,
    "id": "012",
    "title": "ESP8266 Contact ușă (reed)",
    "short": "Deschis / închis pe telefon, LED de stare",
    "board": "NodeMCU ESP8266",
    "tags": [
      "ESP8266",
      "Reed",
      "Ușă"
    ],
    "sketchName": "ESP8266_Door.ino",
    "chipFamily": "ESP8266",
    "usbChip": "CH340",
    "wiring": [
      [
        "Componentă",
        "Pin ESP"
      ],
      [
        "Reed — un capăt",
        "D5"
      ],
      [
        "Reed — celălalt capăt",
        "GND"
      ],
      [
        "LED (opțional) prin 220 Ω",
        "D4 → LED → GND"
      ]
    ],
    "steps": [
      "Upload → AP ESP-Door / 12345678.",
      "Magnet lipit de toc + reed pe ușă.",
      "Browser 192.168.4.1 — DESCHIS când circuitul se rupe."
    ],
    "warnings": [
      "Reed-ul e doar semnal. Nu trece 230 V prin el."
    ],
    "sketch": "#include <ESP8266WiFi.h>\n#include <ESP8266WebServer.h>\n\nconst char* ssid = \"ESP-Door\";\nconst char* password = \"12345678\";\n#define REED_PIN D5\n#define LED_PIN D4\nESP8266WebServer server(80);\n\nvoid handleRoot() {\n  bool openDoor = digitalRead(REED_PIN) == HIGH;\n  String html = \"<!DOCTYPE html><html><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<meta http-equiv='refresh' content='2'><body style='background:#111;color:#eee;text-align:center;font-family:sans-serif;padding:28px'>\";\n  html += \"<h1>Usa / geam</h1><p style='font-size:1.6rem'>\";\n  html += openDoor ? \"<b style='color:#f66'>DESCHIS</b>\" : \"<b style='color:#6c6'>INCHIS</b>\";\n  html += \"</p></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(REED_PIN, INPUT_PULLUP);\n  pinMode(LED_PIN, OUTPUT);\n  WiFi.softAP(ssid, password);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.begin();\n}\nvoid loop() {\n  bool openDoor = digitalRead(REED_PIN) == HIGH;\n  digitalWrite(LED_PIN, openDoor ? LOW : HIGH);\n  server.handleClient();\n}\n"
  },
  {
    "tiktok": "În video scrii: Proiect #013 · Link în bio",
    "schemaImage": "images/013.png",
    "firmwareBin": "firmware/013.bin",
    "firmwareManifest": "firmware/013.manifest.json",
    "published": true,
    "id": "013",
    "title": "ESP32-C3 Distanță HC-SR04",
    "short": "Radar ultrasonic în centimetri, live pe web",
    "board": "ESP32-C3 Super Mini",
    "tags": [
      "ESP32",
      "HC-SR04"
    ],
    "sketchName": "esp32c3_hcsr04.ino",
    "chipFamily": "ESP32-C3",
    "usbChip": "CDC",
    "wiring": [
      [
        "Componentă",
        "ESP32-C3 Super Mini"
      ],
      [
        "HC-SR04 VCC",
        "5V"
      ],
      [
        "HC-SR04 GND",
        "GND"
      ],
      [
        "TRIG",
        "GPIO4"
      ],
      [
        "ECHO",
        "GPIO5 (divisor 5 V→3.3 V recomandat)"
      ]
    ],
    "steps": [
      "Upload → AP ESP-Radar / 12345678.",
      "192.168.4.1 se actualizează la ~1 s.",
      "Domeniu tipic 2–200 cm."
    ],
    "warnings": [
      "ECHO e 5 V pe multe module — folosește divisor 2k2/3k3 către GPIO5."
    ],
    "sketch": "#include <WiFi.h>\n#include <WebServer.h>\n\nconst char* ap_ssid = \"ESP-Radar\";\nconst char* ap_pass = \"12345678\";\n#define TRIG 4\n#define ECHO 5\nWebServer server(80);\nfloat cm = -1;\n\nfloat measure() {\n  digitalWrite(TRIG, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG, LOW);\n  long us = pulseIn(ECHO, HIGH, 30000);\n  if (us == 0) return -1;\n  return us / 58.0;\n}\n\nvoid handleRoot() {\n  String html = \"<!DOCTYPE html><html><meta name='viewport' content='width=device-width,initial-scale=1'>\";\n  html += \"<meta http-equiv='refresh' content='1'><body style='background:#111;color:#eee;text-align:center;font-family:sans-serif;padding:28px'>\";\n  html += \"<h1>HC-SR04</h1><p style='font-size:2rem'>\";\n  html += (cm < 0) ? \"-- cm\" : (String(cm, 1) + \" cm\");\n  html += \"</p></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(TRIG, OUTPUT);\n  pinMode(ECHO, INPUT);\n  WiFi.softAP(ap_ssid, ap_pass);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.begin();\n}\nvoid loop() {\n  cm = measure();\n  server.handleClient();\n  delay(80);\n}\n"
  }
];

window.findProject = function (raw) {
  if (!raw) return null;
  var s = String(raw).trim().toUpperCase().replace(/^#/, '').replace(/^P/, '');
  if (/^\d+$/.test(s)) s = ('000' + s).slice(-3);
  for (var i = 0; i < window.PROJECTS.length; i++) {
    if (window.PROJECTS[i].id === s) return window.PROJECTS[i];
  }
  return null;
};
