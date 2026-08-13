/* Limbi site: ro / ru / en — UI + texte proiect */

const I18N = {
  ro: {
    metaTitle: "Proiecte IoT – schemă + sketch ESP",
    metaDesc: "Proiecte IoT de reprodus: schemă de cablare și sketch Arduino/ESP gata de upload.",
    brand: "Proiecte IoT",
    tagline: "schemă + sketch",
    backAll: "← Toate proiectele",
    hubTitle: "Proiecte IoT",
    hubLead: "Vrei să reproduci un proiect din video? Introdu numărul și primești schema + sketch-ul.",
    numLabel: "Număr proiect",
    numAria: "Număr proiect",
    open: "Deschide",
    examples: "Exemple: 001 · 1 · 002 · 003",
    allProjects: "Toate proiectele",
    foot: "Schemă + sketch public · ESP8266 / ESP32 · reprodus ușor acasă",
    flashBadge: "USB flash",
    notFound: "Nu există proiectul #{id}. Încearcă 001, 002, 003…",
    notFoundId: "Proiectul #{id} nu există.",
    projectLabel: "PROIECT #{id}",
    schemaTitle: "1. Schema de conectare",
    schemaAlt: "Schema proiect #{id}",
    stepsTitle: "2. Pași rapizi",
    sketchTitle: "3. Sketch (cod sursă)",
    copy: "Copiază codul",
    copied: "Copiat!",
    otherProject: "← Alt proiect (introdu numărul)",
    flashTitle: "Încarcă pe ESP (USB)",
    flashMissing:
      "Nu există încă fișier .bin pentru acest proiect. Generează-l din Manager Python → tab Firmware → Generează BIN.",
    flashNote:
      "Conectează placa pe USB → instalează driverul dacă Windows nu vede COM → apasă butonul → alege portul. Doar Chrome sau Edge pe PC.",
    flashLoading: "Se încarcă…",
    flashPrep: "Se pregătește uneltele de flash…",
    flashReady: "Apasă „Încarcă pe ESP”, alege portul USB, apoi Install.",
    flashBtn: "Încarcă pe ESP",
    flashToolsFail: "Nu pot încărca ESP Web Tools (verifică internetul).",
    flashTimeout: "Timeout la încărcarea ESP Web Tools.",
    noSerial:
      "Browserul tău nu suportă Web Serial. Deschide site-ul în Chrome sau Edge pe calculator.",
    downloadBin: "Descarcă .bin",
    downloadBinHint: "(dacă vrei să-l urci cu Arduino IDE / esptool)",
    unsupported: "Browser incompatibil — folosește Chrome / Edge.",
    notAllowed: "Permisiune serial refuzată sau pagină nesigură (HTTPS necesar).",
    driverKicker: "Driver USB pentru această placă",
    driverAlts: "Altă placă / alt cip:",
    driverCdcOk: "Nu trebuie instalat nimic pe Windows 10/11.",
    "drv.CH340.label": "CH340 / CH341",
    "drv.CH340.hint": "NodeMCU, Wemos D1 Mini și majoritatea clonelor ESP8266.",
    "drv.CH340.btn": "Descarcă driver CH340",
    "drv.CP2102.label": "CP2102 (Silicon Labs)",
    "drv.CP2102.hint": "ESP32 DevKit oficial și plăci cu cip CP210x pe USB.",
    "drv.CP2102.btn": "Descarcă driver CP2102",
    "drv.CH9102.label": "CH9102 / CH343",
    "drv.CH9102.hint": "Unele ESP32-C3 / S3 (cip WCH lângă USB).",
    "drv.CH9102.btn": "Descarcă driver CH9102",
    "drv.CDC.label": "USB nativ (CDC)",
    "drv.CDC.hint":
      "ESP32-C3 Super Mini: Windows 10/11 are deja driverul. Dacă nu apare COM, încearcă CH340.",
    "drv.FTDI.label": "FTDI FT232",
    "drv.FTDI.hint": "Plăci cu cip FTDI pe USB.",
    "drv.FTDI.btn": "Descarcă driver FTDI",
  },
  en: {
    metaTitle: "IoT projects – wiring + ESP sketch",
    metaDesc: "Reproduce IoT projects: wiring diagram and Arduino/ESP sketch ready to upload.",
    brand: "IoT Projects",
    tagline: "diagram + sketch",
    backAll: "← All projects",
    hubTitle: "IoT Projects",
    hubLead: "Want to rebuild a project from the video? Enter the number to get the diagram and sketch.",
    numLabel: "Project number",
    numAria: "Project number",
    open: "Open",
    examples: "Examples: 001 · 1 · 002 · 003",
    allProjects: "All projects",
    foot: "Public diagram + sketch · ESP8266 / ESP32 · easy to rebuild at home",
    flashBadge: "USB flash",
    notFound: "Project #{id} does not exist. Try 001, 002, 003…",
    notFoundId: "Project #{id} does not exist.",
    projectLabel: "PROJECT #{id}",
    schemaTitle: "1. Wiring diagram",
    schemaAlt: "Diagram for project #{id}",
    stepsTitle: "2. Quick steps",
    sketchTitle: "3. Sketch (source code)",
    copy: "Copy code",
    copied: "Copied!",
    otherProject: "← Another project (enter the number)",
    flashTitle: "Flash to ESP (USB)",
    flashMissing:
      "There is no .bin file for this project yet. Generate it in the Python Manager → Firmware tab → Generate BIN.",
    flashNote:
      "Connect the board over USB → install the driver if Windows shows no COM port → press the button → pick the port. Chrome or Edge on a PC only.",
    flashLoading: "Loading…",
    flashPrep: "Preparing flash tools…",
    flashReady: "Press “Flash to ESP”, pick the USB port, then Install.",
    flashBtn: "Flash to ESP",
    flashToolsFail: "Cannot load ESP Web Tools (check your internet).",
    flashTimeout: "Timed out loading ESP Web Tools.",
    noSerial:
      "This browser does not support Web Serial. Open the site in Chrome or Edge on a computer.",
    downloadBin: "Download .bin",
    downloadBinHint: "(if you want to flash with Arduino IDE / esptool)",
    unsupported: "Incompatible browser — use Chrome or Edge.",
    notAllowed: "Serial permission denied, or the page is not HTTPS.",
    driverKicker: "USB driver for this board",
    driverAlts: "Different board / chip:",
    driverCdcOk: "Nothing to install on Windows 10/11.",
    "drv.CH340.label": "CH340 / CH341",
    "drv.CH340.hint": "NodeMCU, Wemos D1 Mini and most ESP8266 clones.",
    "drv.CH340.btn": "Download CH340 driver",
    "drv.CP2102.label": "CP2102 (Silicon Labs)",
    "drv.CP2102.hint": "Official ESP32 DevKit and boards with a CP210x USB chip.",
    "drv.CP2102.btn": "Download CP2102 driver",
    "drv.CH9102.label": "CH9102 / CH343",
    "drv.CH9102.hint": "Some ESP32-C3 / S3 boards (WCH chip next to USB).",
    "drv.CH9102.btn": "Download CH9102 driver",
    "drv.CDC.label": "Native USB (CDC)",
    "drv.CDC.hint":
      "ESP32-C3 Super Mini: Windows 10/11 already has the driver. If no COM port appears, try CH340.",
    "drv.FTDI.label": "FTDI FT232",
    "drv.FTDI.hint": "Boards with an FTDI USB chip.",
    "drv.FTDI.btn": "Download FTDI driver",
  },
  ru: {
    metaTitle: "IoT-проекты – схема + скетч ESP",
    metaDesc: "Повторите IoT-проект: схема подключения и скетч Arduino/ESP для загрузки.",
    brand: "IoT-проекты",
    tagline: "схема + скетч",
    backAll: "← Все проекты",
    hubTitle: "IoT-проекты",
    hubLead: "Хотите повторить проект из видео? Введите номер — получите схему и скетч.",
    numLabel: "Номер проекта",
    numAria: "Номер проекта",
    open: "Открыть",
    examples: "Примеры: 001 · 1 · 002 · 003",
    allProjects: "Все проекты",
    foot: "Публичная схема + скетч · ESP8266 / ESP32 · легко повторить дома",
    flashBadge: "USB flash",
    notFound: "Проекта #{id} нет. Попробуйте 001, 002, 003…",
    notFoundId: "Проекта #{id} нет.",
    projectLabel: "ПРОЕКТ #{id}",
    schemaTitle: "1. Схема подключения",
    schemaAlt: "Схема проекта #{id}",
    stepsTitle: "2. Краткие шаги",
    sketchTitle: "3. Скетч (исходный код)",
    copy: "Копировать код",
    copied: "Скопировано!",
    otherProject: "← Другой проект (введите номер)",
    flashTitle: "Загрузить на ESP (USB)",
    flashMissing:
      "Для этого проекта ещё нет файла .bin. Создайте его в Python Manager → вкладка Firmware → Generate BIN.",
    flashNote:
      "Подключите плату по USB → установите драйвер, если Windows не видит COM → нажмите кнопку → выберите порт. Только Chrome или Edge на ПК.",
    flashLoading: "Загрузка…",
    flashPrep: "Подготовка инструментов прошивки…",
    flashReady: "Нажмите «Загрузить на ESP», выберите USB-порт, затем Install.",
    flashBtn: "Загрузить на ESP",
    flashToolsFail: "Не удалось загрузить ESP Web Tools (проверьте интернет).",
    flashTimeout: "Тайм-аут загрузки ESP Web Tools.",
    noSerial:
      "Браузер не поддерживает Web Serial. Откройте сайт в Chrome или Edge на компьютере.",
    downloadBin: "Скачать .bin",
    downloadBinHint: "(если прошиваете через Arduino IDE / esptool)",
    unsupported: "Несовместимый браузер — используйте Chrome или Edge.",
    notAllowed: "Нет доступа к COM или страница не HTTPS.",
    driverKicker: "USB-драйвер для этой платы",
    driverAlts: "Другая плата / чип:",
    driverCdcOk: "На Windows 10/11 ничего ставить не нужно.",
    "drv.CH340.label": "CH340 / CH341",
    "drv.CH340.hint": "NodeMCU, Wemos D1 Mini и большинство клонов ESP8266.",
    "drv.CH340.btn": "Скачать драйвер CH340",
    "drv.CP2102.label": "CP2102 (Silicon Labs)",
    "drv.CP2102.hint": "Официальный ESP32 DevKit и платы с чипом CP210x.",
    "drv.CP2102.btn": "Скачать драйвер CP2102",
    "drv.CH9102.label": "CH9102 / CH343",
    "drv.CH9102.hint": "Некоторые ESP32-C3 / S3 (чип WCH рядом с USB).",
    "drv.CH9102.btn": "Скачать драйвер CH9102",
    "drv.CDC.label": "Встроенный USB (CDC)",
    "drv.CDC.hint":
      "ESP32-C3 Super Mini: в Windows 10/11 драйвер уже есть. Если COM не появился — поставьте CH340.",
    "drv.FTDI.label": "FTDI FT232",
    "drv.FTDI.hint": "Платы с USB-чипом FTDI.",
    "drv.FTDI.btn": "Скачать драйвер FTDI",
  },
};

const PROJECT_I18N = {
  "001": {
    en: {
      title: "ESP8266 Relay – Access Point",
      short: "Relay ON/OFF from your phone, no router",
      steps: [
        "Arduino IDE → Board: NodeMCU 1.0 (ESP-12E).",
        "Copy the sketch → Upload.",
        "Phone Wi‑Fi: ESP-Relay (password 12345678).",
        "Browser → 192.168.4.1 → ON / OFF.",
      ],
      warnings: [
        "230 V load on COM/NO/NC — separate supply from the ESP.",
        "Do not connect 230 V to NodeMCU pins.",
        "If ON/OFF is inverted, swap HIGH ↔ LOW.",
      ],
    },
    ru: {
      title: "ESP8266 реле – точка доступа",
      short: "Вкл/выкл реле с телефона, без роутера",
      steps: [
        "Arduino IDE → плата: NodeMCU 1.0 (ESP-12E).",
        "Скопируйте скетч → Upload.",
        "Wi‑Fi телефона: ESP-Relay (пароль 12345678).",
        "Браузер → 192.168.4.1 → ON / OFF.",
      ],
      warnings: [
        "Нагрузка 230 В на COM/NO/NC — питание отдельно от ESP.",
        "Не подключайте 230 В к выводам NodeMCU.",
        "Если ON/OFF наоборот, поменяйте HIGH ↔ LOW.",
      ],
    },
  },
  "002": {
    en: {
      title: "ESP32 temperature + 2 relays",
      short: "DS18B20 + 2 relays on ESP32-C3, web over AP",
      steps: [
        "Board: ESP32C3 Dev Module + OneWire, DallasTemperature libraries.",
        "Upload the sketch → AP ESP32-Temp / 12345678.",
        "Open the IP shown in Serial Monitor.",
      ],
      warnings: [
        "Relay load on COM/NO/NC, separate supply.",
        "Do not connect 230 V to ESP pins.",
      ],
    },
    ru: {
      title: "ESP32 температура + 2 реле",
      short: "DS18B20 + 2 реле на ESP32-C3, веб через AP",
      steps: [
        "Плата: ESP32C3 Dev Module + библиотеки OneWire, DallasTemperature.",
        "Загрузите скетч → AP ESP32-Temp / 12345678.",
        "Откройте IP из Serial Monitor.",
      ],
      warnings: [
        "Нагрузка реле на COM/NO/NC, отдельное питание.",
        "Не подключайте 230 В к выводам ESP.",
      ],
    },
  },
  "003": {
    en: {
      title: "ESP8266 / NodeMCU Smart Scheduler",
      short: "Relay scheduler: captive portal, Moldova NTP, up to 12 programs",
      steps: ["Upload the sketch to the board."],
      warnings: ["Do not connect 230 V to ESP pins."],
    },
    ru: {
      title: "ESP8266 / NodeMCU Smart Scheduler",
      short: "Планировщик реле: captive portal, NTP Молдова, до 12 программ",
      steps: ["Загрузите скетч на плату."],
      warnings: ["Не подключайте 230 В к выводам ESP."],
    },
  },
};

const LANGS = ["ro", "ru", "en"];
const LANG_KEY = "iot-lang";

function detectLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) return saved;
  } catch (e) {
    /* ignore */
  }
  const nav = String(
    (navigator.languages && navigator.languages[0]) || navigator.language || ""
  ).toLowerCase();
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("en")) return "en";
  return "ro";
}

let currentLang = detectLang();

function getLang() {
  return currentLang;
}

function t(key, vars) {
  const pack = I18N[currentLang] || I18N.ro;
  let s = pack[key] != null ? pack[key] : (I18N.ro[key] != null ? I18N.ro[key] : key);
  if (vars) {
    Object.keys(vars).forEach((k) => {
      s = String(s).split("#{" + k + "}").join(String(vars[k]));
    });
  }
  return s;
}

function localizedProject(p) {
  if (!p) return p;
  if (currentLang === "ro") return p;
  const extra = (PROJECT_I18N[p.id] || {})[currentLang];
  if (!extra) return p;
  return Object.assign({}, p, extra);
}

function setLang(lang) {
  if (!I18N[lang]) lang = "ro";
  currentLang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    /* ignore */
  }
  document.documentElement.lang = lang;
  document.title = t("metaTitle");
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", t("metaDesc"));
  applyStaticI18n();
  if (typeof route === "function") route();
}

function applyStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
}

function renderLangSwitch() {
  return `<nav class="lang-switch" aria-label="Language">
    ${LANGS.map((code) => {
      const on = code === currentLang ? " is-on" : "";
      return `<button type="button" class="lang-btn${on}" data-lang="${code}">${code.toUpperCase()}</button>`;
    }).join("")}
  </nav>`;
}

function bindLangSwitch(root) {
  (root || document).querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
  });
}
