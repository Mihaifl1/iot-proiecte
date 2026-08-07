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
    "sketch": "#include <ESP8266WiFi.h>\n#include <ESP8266WebServer.h>\n\nconst char* ssid = \"ESP-Relay\";\nconst char* password = \"12345678\";\n\nESP8266WebServer server(80);\nconst int relayPin = D1;\nbool relayState = false;\n\nvoid handleRoot() {\n  String html = R\"=====(\n<!DOCTYPE html><html><head>\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>ESP Relay</title>\n<style>\nbody{font-family:Arial;text-align:center;background:#111;color:#fff;padding-top:40px}\n.btn{display:inline-block;padding:20px 50px;font-size:24px;margin:20px;border:none;border-radius:12px;color:#fff}\n.on{background:#00c853}.off{background:#d50000}\n</style></head><body>\n<h1>ESP Relay Control</h1>\n<p>Status: <b>)=====\";\n  html += relayState ? \"ON\" : \"OFF\";\n  html += R\"=====(</b></p>\n<a href=\"/on\"><button class=\"btn on\">ON</button></a>\n<a href=\"/off\"><button class=\"btn off\">OFF</button></a>\n</body></html>)=====\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid handleOn() {\n  digitalWrite(relayPin, HIGH);\n  relayState = true;\n  server.sendHeader(\"Location\", \"/\");\n  server.send(303);\n}\n\nvoid handleOff() {\n  digitalWrite(relayPin, LOW);\n  relayState = false;\n  server.sendHeader(\"Location\", \"/\");\n  server.send(303);\n}\n\nvoid setup() {\n  pinMode(relayPin, OUTPUT);\n  digitalWrite(relayPin, LOW);\n  Serial.begin(115200);\n  WiFi.softAP(ssid, password);\n  server.on(\"/\", handleRoot);\n  server.on(\"/on\", handleOn);\n  server.on(\"/off\", handleOff);\n  server.begin();\n}\n\nvoid loop() {\n  server.handleClient();\n}",
    "schemaImage": ""
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
    "warnings": [
      "Sarcina pe relee: COM/NO/NC, alimentare separată.",
      "Nu lega 230V la pinii ESP."
    ],
    "steps": [
      "Board: ESP32C3 Dev Module + librării OneWire, DallasTemperature.",
      "Upload sketch → AP ESP32-Temp / 12345678.",
      "Browser pe IP din Serial Monitor."
    ],
    "sketchName": "esp32c3_temp_relays.ino",
    "sketch": "#include <WiFi.h>\n#include <WebServer.h>\n#include <OneWire.h>\n#include <DallasTemperature.h>\n\nconst char* ap_ssid = \"ESP32-Temp\";\nconst char* ap_pass = \"12345678\";\n#define ONE_WIRE_BUS 4\n#define RELAY1 5\n#define RELAY2 6\n\nOneWire oneWire(ONE_WIRE_BUS);\nDallasTemperature sensors(&oneWire);\nWebServer server(80);\nbool r1 = false, r2 = false;\n\nvoid applyRelays() {\n  digitalWrite(RELAY1, r1 ? HIGH : LOW);\n  digitalWrite(RELAY2, r2 ? HIGH : LOW);\n}\n\nvoid handleRoot() {\n  sensors.requestTemperatures();\n  float t = sensors.getTempCByIndex(0);\n  String html = \"<!DOCTYPE html><html><body style='background:#111;color:#fff;text-align:center;font-family:Arial'>\";\n  html += \"<h2>ESP32 Temp</h2><p>\" + String(t, 1) + \" C</p>\";\n  html += \"<p>R1:\" + String(r1?\"ON\":\"OFF\") + \" R2:\" + String(r2?\"ON\":\"OFF\") + \"</p>\";\n  html += \"<p><a href='/r1on'>R1 ON</a> <a href='/r1off'>R1 OFF</a></p>\";\n  html += \"<p><a href='/r2on'>R2 ON</a> <a href='/r2off'>R2 OFF</a></p></body></html>\";\n  server.send(200, \"text/html\", html);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(RELAY1, OUTPUT);\n  pinMode(RELAY2, OUTPUT);\n  applyRelays();\n  sensors.begin();\n  WiFi.softAP(ap_ssid, ap_pass);\n  Serial.println(WiFi.softAPIP());\n  server.on(\"/\", handleRoot);\n  server.on(\"/r1on\", []() { r1 = true; applyRelays(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/r1off\", []() { r1 = false; applyRelays(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/r2on\", []() { r2 = true; applyRelays(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/r2off\", []() { r2 = false; applyRelays(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.begin();\n}\n\nvoid loop() { server.handleClient(); }\n",
    "schemaImage": "images/002.jpg"
  },
  {
    "id": "003",
    "title": "Motor DC + BTS7960",
    "short": "NodeMCU + IBT_2, control web pe Access Point",
    "board": "NodeMCU ESP8266 + BTS7960",
    "tags": [
      "ESP8266",
      "Motor",
      "BTS7960"
    ],
    "tiktok": "În video scrii: Proiect #003 · Link în bio",
    "wiring": [
      [
        "BTS7960 (IBT_2)",
        "NodeMCU"
      ],
      [
        "VCC",
        "3V3"
      ],
      [
        "GND",
        "GND"
      ],
      [
        "R_EN",
        "D7"
      ],
      [
        "L_EN",
        "D8"
      ],
      [
        "RPWM",
        "D5"
      ],
      [
        "LPWM",
        "D6"
      ]
    ],
    "warnings": [
      "Motor pe M+/M-; alimentare motor SEPARATĂ.",
      "GND comun sursă motor + NodeMCU."
    ],
    "steps": [
      "Board NodeMCU 1.0 → Upload.",
      "WiFi ESP-Motor / 12345678 → 192.168.4.1"
    ],
    "sketchName": "motor_nodemcu_ap.ino",
    "sketch": "#include <ESP8266WiFi.h>\n#include <ESP8266WebServer.h>\n\nconst char* ssid = \"ESP-Motor\";\nconst char* password = \"12345678\";\nconst int RPWM = D5, LPWM = D6, R_EN = D7, L_EN = D8;\nESP8266WebServer server(80);\n\nvoid stopMotor() { analogWrite(RPWM, 0); analogWrite(LPWM, 0); }\nvoid forward(int s) { analogWrite(LPWM, 0); analogWrite(RPWM, s); }\nvoid reverse(int s) { analogWrite(RPWM, 0); analogWrite(LPWM, s); }\n\nvoid handleRoot() {\n  server.send(200, \"text/html\",\n    \"<html><body style='background:#111;color:#fff;text-align:center;font-family:Arial'>\"\n    \"<h1>Motor DC</h1>\"\n    \"<p><a href='/fwd'>INAINTE</a> | <a href='/rev'>INAPOI</a> | <a href='/stop'>STOP</a></p>\"\n    \"</body></html>\");\n}\n\nvoid setup() {\n  pinMode(RPWM, OUTPUT); pinMode(LPWM, OUTPUT);\n  pinMode(R_EN, OUTPUT); pinMode(L_EN, OUTPUT);\n  digitalWrite(R_EN, HIGH); digitalWrite(L_EN, HIGH);\n  stopMotor();\n  WiFi.softAP(ssid, password);\n  server.on(\"/\", handleRoot);\n  server.on(\"/fwd\", []() { forward(700); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/rev\", []() { reverse(700); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/stop\", []() { stopMotor(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.begin();\n}\n\nvoid loop() { server.handleClient(); }\n",
    "schemaImage": ""
  },
  {
    "id": "004",
    "title": "Irigație flori (NodeMCU)",
    "short": "Automatizare udare — releu pompă pe AP",
    "board": "NodeMCU ESP8266",
    "tags": [
      "ESP8266",
      "Irigație"
    ],
    "tiktok": "În video scrii: Proiect #004 · Link în bio",
    "wiring": [
      [
        "Componentă",
        "NodeMCU"
      ],
      [
        "Modul releu pompă IN",
        "D1"
      ],
      [
        "Releu VCC / GND",
        "3V3 / GND"
      ]
    ],
    "warnings": [
      "Pompă pe COM-NO, alimentare separată."
    ],
    "steps": [
      "Upload sketch pe NodeMCU.",
      "WiFi ESP-Irigatie / 12345678 → 192.168.4.1"
    ],
    "sketchName": "irigatie_schelet.ino",
    "sketch": "#include <ESP8266WiFi.h>\n#include <ESP8266WebServer.h>\n\nconst char* ssid = \"ESP-Irigatie\";\nconst char* password = \"12345678\";\nconst int PUMP_RELAY = D1;\nESP8266WebServer server(80);\nbool pumpOn = false;\n\nvoid applyPump() { digitalWrite(PUMP_RELAY, pumpOn ? HIGH : LOW); }\n\nvoid setup() {\n  pinMode(PUMP_RELAY, OUTPUT);\n  applyPump();\n  WiFi.softAP(ssid, password);\n  server.on(\"/\", []() {\n    String h = \"<html><body style='background:#111;color:#fff;text-align:center'>\";\n    h += \"<h2>Irigatie</h2><p>\" + String(pumpOn ? \"ON\" : \"OFF\") + \"</p>\";\n    h += \"<a href='/on'>UDA</a> | <a href='/off'>STOP</a></body></html>\";\n    server.send(200, \"text/html\", h);\n  });\n  server.on(\"/on\", []() { pumpOn = true; applyPump(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.on(\"/off\", []() { pumpOn = false; applyPump(); server.sendHeader(\"Location\", \"/\"); server.send(303); });\n  server.begin();\n}\n\nvoid loop() { server.handleClient(); }\n",
    "schemaImage": ""
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
