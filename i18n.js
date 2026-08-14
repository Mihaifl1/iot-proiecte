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
    adminLink: "Manager",
    adminTitle: "Manager Python",
    adminLead: "Descarcă programul cu care editezi site-ul. Introdu parola.",
    adminPassLabel: "Parolă",
    adminDownload: "Descarcă",
    adminBadPw: "Parolă greșită.",
    adminDlOk: "Descărcare pornită. Arhiva se deschide cu aceeași parolă.",
    adminBack: "← Înapoi la proiecte",
    themeFunOff: "Temă veselă",
    themeFunOn: "Temă calmă",
    shopLink: "Magazin",
    shopBrand: "Magazin IoT",
    shopTitle: "Magazin componente",
    shopLead: "Tot ce-ți trebuie ca să reproduci proiectele ESP. Adaugi în coș, prețurile sunt în lei (MDL).",
    shopAll: "Toate",
    shopCart: "Coș (0)",
    shopCartN: "Coș (#{n})",
    shopCartTitle: "Coșul tău",
    shopCartEmpty: "Coșul e gol.",
    shopAdd: "Adaugă în coș",
    shopUsed: "Pentru proiecte",
    shopStock: "Stoc: #{n}",
    shopOut: "Stoc epuizat",
    shopTotal: "Total",
    shopName: "Nume",
    shopPhone: "Telefon",
    shopCity: "Oraș",
    shopNote: "Notă (opțional)",
    shopPayHint: "Plata online reală urmează. Acum comanda se înregistrează și te contactăm.",
    shopOrder: "Trimite comanda",
    shopOrderOk: "Comanda e înregistrată. Te contactăm pe telefon. Plata online o legăm după ce îmi spui cum vrei să încasezi.",
    shopNone: "Niciun produs în această categorie.",
    shopBack: "← Proiecte IoT",
    shopMetaTitle: "Magazin IoT – componente ESP",
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
    adminLink: "Manager",
    adminTitle: "Python Manager",
    adminLead: "Download the program used to edit the site. Enter the password.",
    adminPassLabel: "Password",
    adminDownload: "Download",
    adminBadPw: "Wrong password.",
    adminDlOk: "Download started. Open the archive with the same password.",
    adminBack: "← Back to projects",
    themeFunOff: "Cheerful theme",
    themeFunOn: "Calm theme",
    shopLink: "Shop",
    shopBrand: "IoT Shop",
    shopTitle: "Component shop",
    shopLead: "Everything you need to rebuild the ESP projects. Add to cart; prices are in MDL.",
    shopAll: "All",
    shopCart: "Cart (0)",
    shopCartN: "Cart (#{n})",
    shopCartTitle: "Your cart",
    shopCartEmpty: "Cart is empty.",
    shopAdd: "Add to cart",
    shopUsed: "For projects",
    shopStock: "Stock: #{n}",
    shopOut: "Out of stock",
    shopTotal: "Total",
    shopName: "Name",
    shopPhone: "Phone",
    shopCity: "City",
    shopNote: "Note (optional)",
    shopPayHint: "Real online payment comes later. For now the order is stored and we will contact you.",
    shopOrder: "Place order",
    shopOrderOk: "Order saved. We will call you. Online payment will be wired when you choose a provider.",
    shopNone: "No products in this category.",
    shopBack: "← IoT projects",
    shopMetaTitle: "IoT shop – ESP components",
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
    adminLink: "Manager",
    adminTitle: "Python Manager",
    adminLead: "Скачайте программу для редактирования сайта. Введите пароль.",
    adminPassLabel: "Пароль",
    adminDownload: "Скачать",
    adminBadPw: "Неверный пароль.",
    adminDlOk: "Загрузка началась. Архив открывается тем же паролем.",
    adminBack: "← Назад к проектам",
    themeFunOff: "Весёлая тема",
    themeFunOn: "Спокойная тема",
    shopLink: "Магазин",
    shopBrand: "IoT магазин",
    shopTitle: "Магазин компонентов",
    shopLead: "Всё для повторения проектов ESP. В корзину, цены в леях (MDL).",
    shopAll: "Все",
    shopCart: "Корзина (0)",
    shopCartN: "Корзина (#{n})",
    shopCartTitle: "Ваша корзина",
    shopCartEmpty: "Корзина пуста.",
    shopAdd: "В корзину",
    shopUsed: "Для проектов",
    shopStock: "Склад: #{n}",
    shopOut: "Нет в наличии",
    shopTotal: "Итого",
    shopName: "Имя",
    shopPhone: "Телефон",
    shopCity: "Город",
    shopNote: "Заметка (необязательно)",
    shopPayHint: "Настоящая онлайн-оплата будет позже. Сейчас заказ сохраняется, мы свяжемся с вами.",
    shopOrder: "Отправить заказ",
    shopOrderOk: "Заказ сохранён. Мы позвоним. Онлайн-оплату подключим, когда выберете способ.",
    shopNone: "В этой категории нет товаров.",
    shopBack: "← IoT-проекты",
    shopMetaTitle: "IoT магазин – компоненты ESP",
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
  "004": {
    en: {
      title: "ESP8266 DHT22 thermometer",
      short: "Temperature + humidity on your phone, no router",
      steps: [
        "Arduino IDE → Board: NodeMCU 1.0 + DHT sensor library (Adafruit).",
        "Upload → Wi‑Fi ESP-DHT / 12345678.",
        "Browser → 192.168.4.1 — refreshes every 5 s.",
      ],
      warnings: ["DHT22 is 3.3–5 V; on NodeMCU use 3V3.", "Do not connect 230 V to ESP pins."],
    },
    ru: {
      title: "ESP8266 термометр DHT22",
      short: "Температура и влажность на телефоне, без роутера",
      steps: [
        "Arduino IDE → плата NodeMCU 1.0 + библиотека DHT (Adafruit).",
        "Загрузка → Wi‑Fi ESP-DHT / 12345678.",
        "Браузер → 192.168.4.1 — обновление каждые 5 с.",
      ],
      warnings: ["DHT22: 3.3–5 В; на NodeMCU используйте 3V3.", "Не подключайте 230 В к выводам ESP."],
    },
  },
  "005": {
    en: {
      title: "ESP32-C3 PIR alarm",
      short: "Motion + buzzer, arm/disarm from the phone over AP",
      steps: [
        "Board: ESP32C3 Dev Module.",
        "Upload → AP ESP-PIR / 12345678 → 192.168.4.1.",
        "Arm / disarm on the page. PIR needs ~30 s to warm up.",
      ],
      warnings: [
        "HC-SR501 PIR modules prefer 5 V on VCC.",
        "Use a small active buzzer on a 3.3 V pin.",
      ],
    },
    ru: {
      title: "ESP32-C3 сигнализация PIR",
      short: "Движение + пищалка, постановка с телефона через AP",
      steps: [
        "Плата: ESP32C3 Dev Module.",
        "Загрузка → AP ESP-PIR / 12345678 → 192.168.4.1.",
        "Постановка / снятие на странице. PIR греется ~30 с.",
      ],
      warnings: [
        "Модули HC-SR501 лучше питать 5 В.",
        "Берите маленький активный зуммер на пин 3.3 В.",
      ],
    },
  },
  "006": {
    en: {
      title: "ESP8266 plant waterer",
      short: "Soil sensor + pump/relay, web control",
      steps: [
        "Upload → AP ESP-Plant / 12345678.",
        "Browser 192.168.4.1 — analog value and pump ON/OFF.",
        "Calibrate dry air vs water, then pick a threshold.",
      ],
      warnings: [
        "Relay load on COM/NO/NC, separate supply.",
        "12 V / 230 V pump only on relay contacts, not on the ESP.",
        "Do not connect 230 V to ESP pins.",
      ],
    },
    ru: {
      title: "ESP8266 полив растений",
      short: "Датчик почвы + насос/реле, управление с веба",
      steps: [
        "Загрузка → AP ESP-Plant / 12345678.",
        "Браузер 192.168.4.1 — значение АЦП и насос.",
        "Откалибруйте сухой воздух и воду, затем порог.",
      ],
      warnings: [
        "Нагрузка реле на COM/NO/NC, отдельное питание.",
        "Насос 12 В / 230 В только на контактах реле.",
        "Не подключайте 230 В к выводам ESP.",
      ],
    },
  },
  "007": {
    en: {
      title: "ESP32 WS2812 LED strip",
      short: "RGB color from the browser, 8 LEDs over AP",
      steps: [
        "Library: Adafruit NeoPixel.",
        "Upload → AP ESP-RGB / 12345678 → 192.168.4.1.",
        "Move R/G/B sliders and press Set.",
      ],
      warnings: ["Common GND. For many LEDs, power the strip from a separate 5 V supply."],
    },
    ru: {
      title: "ESP32 лента WS2812",
      short: "Цвет RGB из браузера, 8 светодиодов через AP",
      steps: [
        "Библиотека Adafruit NeoPixel.",
        "Загрузка → AP ESP-RGB / 12345678 → 192.168.4.1.",
        "Ползунки R/G/B и кнопка Set.",
      ],
      warnings: ["Общий GND. Много светодиодов — питание ленты отдельно 5 В."],
    },
  },
  "008": {
    en: {
      title: "ESP8266 4-relay panel",
      short: "Four ON/OFF outputs from the phone, AP",
      steps: [
        "Upload → AP ESP-4Relay / 12345678.",
        "192.168.4.1 — ON/OFF per channel.",
        "If logic is inverted, swap HIGH ↔ LOW in the sketch.",
      ],
      warnings: [
        "Relay load on COM/NO/NC, separate supply.",
        "Do not connect 230 V to ESP pins.",
      ],
    },
    ru: {
      title: "ESP8266 панель 4 реле",
      short: "Четыре выхода ON/OFF с телефона, AP",
      steps: [
        "Загрузка → AP ESP-4Relay / 12345678.",
        "192.168.4.1 — ON/OFF по каналам.",
        "Если логика инверсная, поменяйте HIGH ↔ LOW.",
      ],
      warnings: [
        "Нагрузка реле на COM/NO/NC, отдельное питание.",
        "Не подключайте 230 В к выводам ESP.",
      ],
    },
  },
  "009": {
    en: {
      title: "ESP32-C3 web servo",
      short: "0–180° from the phone, no router",
      steps: [
        "Library: ESP32Servo.",
        "Upload → AP ESP-Servo / 12345678 → 192.168.4.1.",
        "Slide the angle or tap 0 / 90 / 180.",
      ],
      warnings: ["Servos surge current — common GND, separate 5 V if the ESP browns out."],
    },
    ru: {
      title: "ESP32-C3 сервопривод с веба",
      short: "Угол 0–180° с телефона, без роутера",
      steps: [
        "Библиотека ESP32Servo.",
        "Загрузка → AP ESP-Servo / 12345678 → 192.168.4.1.",
        "Ползунок или кнопки 0 / 90 / 180.",
      ],
      warnings: ["Серво даёт бросок тока — общий GND, 5 В отдельно если ESP перезапускается."],
    },
  },
  "010": {
    en: {
      title: "ESP8266 water-leak alarm",
      short: "Liquid sensor + buzzer, status on the web",
      steps: [
        "Upload → AP ESP-Leak / 12345678.",
        "192.168.4.1 refreshes by itself.",
        "Mute silences the buzzer; sensor is active LOW when wet.",
      ],
      warnings: [
        "Keep electronics away from water. Only the probe goes low.",
        "Do not connect 230 V to ESP pins.",
      ],
    },
    ru: {
      title: "ESP8266 протечка воды",
      short: "Датчик жидкости + пищалка, статус на вебе",
      steps: [
        "Загрузка → AP ESP-Leak / 12345678.",
        "192.168.4.1 обновляется сам.",
        "Mute глушит звук; датчик активен LOW когда мокрый.",
      ],
      warnings: [
        "Электронику держите сухой. Внизу только щуп.",
        "Не подключайте 230 В к выводам ESP.",
      ],
    },
  },
  "011": {
    en: {
      title: "ESP32 OLED weather + DHT22",
      short: "Temperature on a 0.96\" screen and on the phone",
      steps: [
        "Libraries: DHT, Adafruit SSD1306, Adafruit GFX.",
        "Upload → AP ESP-Meteo / 12345678.",
        "OLED shows values; web page at 192.168.4.1.",
      ],
      warnings: ["If the screen is black, I2C address may be 0x3D instead of 0x3C."],
    },
    ru: {
      title: "ESP32 погода OLED + DHT22",
      short: "Температура на экране 0.96\" и на телефоне",
      steps: [
        "Библиотеки: DHT, Adafruit SSD1306, Adafruit GFX.",
        "Загрузка → AP ESP-Meteo / 12345678.",
        "OLED показывает значения; веб 192.168.4.1.",
      ],
      warnings: ["Если экран чёрный, адрес I2C может быть 0x3D вместо 0x3C."],
    },
  },
  "012": {
    en: {
      title: "ESP8266 door reed switch",
      short: "Open / closed on the phone, status LED",
      steps: [
        "Upload → AP ESP-Door / 12345678.",
        "Magnet on the frame + reed on the door.",
        "Browser 192.168.4.1 — OPEN when the circuit breaks.",
      ],
      warnings: ["The reed is signal only. Do not put 230 V through it."],
    },
    ru: {
      title: "ESP8266 геркон двери",
      short: "Открыто / закрыто на телефоне, светодиод статуса",
      steps: [
        "Загрузка → AP ESP-Door / 12345678.",
        "Магнит на коробке + геркон на двери.",
        "Браузер 192.168.4.1 — ОТКРЫТО когда цепь рвётся.",
      ],
      warnings: ["Геркон только для сигнала. Не пускайте через него 230 В."],
    },
  },
  "013": {
    en: {
      title: "ESP32-C3 HC-SR04 distance",
      short: "Ultrasonic range in centimetres, live on the web",
      steps: [
        "Upload → AP ESP-Radar / 12345678.",
        "192.168.4.1 updates about once a second.",
        "Typical range 2–200 cm.",
      ],
      warnings: ["ECHO is 5 V on many modules — use a 2k2/3k3 divider to GPIO5."],
    },
    ru: {
      title: "ESP32-C3 расстояние HC-SR04",
      short: "Ультразвук в сантиметрах, live на вебе",
      steps: [
        "Загрузка → AP ESP-Radar / 12345678.",
        "192.168.4.1 обновляется примерно раз в секунду.",
        "Типичный диапазон 2–200 см.",
      ],
      warnings: ["ECHO часто 5 В — делитель 2к2/3к3 на GPIO5."],
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
  if (!lang || !I18N[lang]) return;
  currentLang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    /* ignore */
  }
  document.documentElement.lang = lang;
  const titleKey = document.body && document.body.getAttribute("data-title-key");
  document.title = t(titleKey || "metaTitle");
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", t(titleKey ? "shopLead" : "metaDesc"));
  applyStaticI18n();
  const rerender =
    (typeof window !== "undefined" && typeof window.route === "function" && window.route) ||
    (typeof route === "function" ? route : null);
  if (rerender) rerender();
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
  (root || document).querySelectorAll(".lang-btn[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
  });
}

const SHOP_I18N = {
  esp8266: {
    en: { title: "NodeMCU ESP8266", short: "Wi‑Fi board for most ESP8266 projects." },
    ru: { title: "NodeMCU ESP8266", short: "Wi‑Fi плата для большинства проектов ESP8266." },
  },
  esp32c3: {
    en: { title: "ESP32-C3 Super Mini", short: "Tiny USB-C board for the ESP32 projects." },
    ru: { title: "ESP32-C3 Super Mini", short: "Маленькая плата USB-C для проектов ESP32." },
  },
  "arduino-uno": {
    en: { title: "Arduino Uno R3", short: "Classic board for tests and learning." },
    ru: { title: "Arduino Uno R3", short: "Классическая плата для тестов и обучения." },
  },
  "relay-1": {
    en: { title: "1-channel 5V relay", short: "ON/OFF one load. Projects #001, #003, #006, #010." },
    ru: { title: "Реле 1 канал 5В", short: "Вкл/выкл одну нагрузку. #001, #003, #006, #010." },
  },
  "relay-2": {
    en: { title: "2-channel 5V relay", short: "For ESP32 temperature + 2 relays (#002)." },
    ru: { title: "Реле 2 канала 5В", short: "Для ESP32 температура + 2 реле (#002)." },
  },
  "relay-4": {
    en: { title: "4-channel 5V relay", short: "Four outputs panel (#008)." },
    ru: { title: "Реле 4 канала 5В", short: "Панель на 4 выхода (#008)." },
  },
  dht22: {
    en: { title: "DHT22 sensor", short: "Temperature + humidity. #004, #011." },
    ru: { title: "Датчик DHT22", short: "Температура + влажность. #004, #011." },
  },
  ds18b20: {
    en: { title: "DS18B20 + 4.7k resistor", short: "One-wire temperature sensor. #002." },
    ru: { title: "DS18B20 + резистор 4.7к", short: "Датчик температуры на одном проводе. #002." },
  },
  pir: {
    en: { title: "PIR HC-SR501", short: "Motion detect. Alarm #005." },
    ru: { title: "PIR HC-SR501", short: "Датчик движения. Сигнализация #005." },
  },
  hcsr04: {
    en: { title: "HC-SR04 distance sensor", short: "Ultrasonic 2–200 cm. #013." },
    ru: { title: "Датчик расстояния HC-SR04", short: "Ультразвук 2–200 см. #013." },
  },
  soil: {
    en: { title: "Soil moisture sensor", short: "Analog on A0. Planter #006." },
    ru: { title: "Датчик влажности почвы", short: "Аналог на A0. Поливалка #006." },
  },
  leak: {
    en: { title: "Water leak sensor", short: "Wet/dry contact. #010." },
    ru: { title: "Датчик протечки", short: "Контакт мокро/сухо. #010." },
  },
  reed: {
    en: { title: "Reed door contact", short: "Magnet + reed. #012." },
    ru: { title: "Геркон двери", short: "Магнит + геркон. #012." },
  },
  buzzer: {
    en: { title: "Active 5V buzzer", short: "PIR and leak alarm. #005, #010." },
    ru: { title: "Зуммер 5В", short: "Сигнализация PIR и протечка. #005, #010." },
  },
  ws2812: {
    en: { title: "WS2812 strip 8 LEDs", short: "Addressable RGB. #007." },
    ru: { title: "Лента WS2812 8 светодиодов", short: "Адресный RGB. #007." },
  },
  servo: {
    en: { title: "SG90 servo", short: "0–180°. #009." },
    ru: { title: "Сервопривод SG90", short: "0–180°. #009." },
  },
  oled: {
    en: { title: "0.96\" SSD1306 I2C OLED", short: "128×64 screen. Weather #011." },
    ru: { title: "OLED 0.96\" SSD1306 I2C", short: "Экран 128×64. Погода #011." },
  },
  breadboard: {
    en: { title: "400-point breadboard", short: "Prototyping without soldering." },
    ru: { title: "Макетная плата 400 точек", short: "Прототип без пайки." },
  },
  jumpers: {
    en: { title: "Jumper wires (40 pcs)", short: "Mixed M-M / M-F." },
    ru: { title: "Провода jumper (40 шт)", short: "Микс M-M / M-F." },
  },
  resistors: {
    en: { title: "4.7k + 220 Ω resistors", short: "Pull-up for DHT/DS18B20 and LED." },
    ru: { title: "Резисторы 4.7к + 220 Ω", short: "Подтяжка DHT/DS18B20 и светодиод." },
  },
  "usb-micro": {
    en: { title: "USB–Micro USB cable", short: "For NodeMCU ESP8266." },
    ru: { title: "Кабель USB–Micro USB", short: "Для NodeMCU ESP8266." },
  },
  "usb-c": {
    en: { title: "USB-C cable", short: "For ESP32-C3 Super Mini." },
    ru: { title: "Кабель USB–C", short: "Для ESP32-C3 Super Mini." },
  },
};

function localizedShopProduct(p) {
  if (!p) return p;
  const lang = typeof getLang === "function" ? getLang() : "ro";
  if (lang === "ro") return p;
  const extra = (SHOP_I18N[p.id] || {})[lang];
  if (!extra) return p;
  return Object.assign({}, p, extra);
}
