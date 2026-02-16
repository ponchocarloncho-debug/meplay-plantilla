@echo off
title DEPLOY FORZADO - LOCAL MANDA
color 0C

set REPO_URL=https://github.com/ponchocarloncho-debug/meplay-plantilla.git
set BRANCH=main

echo ==========================================
echo     DEPLOY FORZADO (LOCAL TIENE PRIORIDAD)
echo ==========================================
echo.

REM Si no existe repositorio, crearlo
if not exist ".git" (
    echo Inicializando repositorio...
    git init
    git branch -M %BRANCH%
    git remote add origin "%REPO_URL%"
)

REM Asegurar rama main
git checkout %BRANCH% >nul 2>&1

REM Agregar todos los archivos (incluye borrados)
git add -A

REM Crear commit automático
git commit -m "Actualizacion forzada" >nul 2>&1

REM FORZAR que GitHub quede igual que local
git push -u origin %BRANCH% --force

echo.
echo ==========================================
echo   ✅ GITHUB AHORA ES IGUAL A TU CARPETA
echo ==========================================
timeout /t 3 >nul
exit
