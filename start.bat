@echo off
title GW_3078
cd /d "C:\Users\jorge\Systems\Dev\LicLuc"
:: Usamos una sintaxis sin el simbolo pipe (|) para evitar el error de 'Set-Content'
powershell -Command "Set-Content -Path 'C:\Users\jorge\Systems\Dev\LicLuc\.cmdpid' -Value (Get-CimInstance Win32_Process -Filter 'ProcessId=$PID').ParentProcessId"
set PORT=3078
echo Iniciando LicLuc en puerto %PORT%...
call npm run dev
if %errorlevel% neq 0 pause
