@echo off
cd /d "%~dp0"
start http://127.0.0.1:5000
"C:\Users\Rasis\AppData\Local\Programs\Python\Python312\python.exe" app.py
pause
