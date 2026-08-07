@echo off
cd /d "%~dp0"
python -c "import customtkinter" 2>nul || pip install -r requirements.txt
start "" pythonw manager.py
if errorlevel 1 python manager.py
