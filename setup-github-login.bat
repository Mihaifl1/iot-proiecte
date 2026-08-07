@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo === Autentificare GitHub (o singura data) ===
echo Se deschide login-ul. Dupa ce te loghezi, push-ul din Manager va merge automat.
echo.
git -c credential.helper=manager push -u origin main
if errorlevel 1 (
  echo.
  echo Daca a esuat: creeaza token la https://github.com/settings/tokens  (scope repo)
  echo Apoi ruleaza din nou acest fisier; Username=GitHub, Password=TOKEN.
  pause
  exit /b 1
)
echo.
echo OK - GitHub e conectat. Poti folosi Manager cu Auto GitHub.
pause
