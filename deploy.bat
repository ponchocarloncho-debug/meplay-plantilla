@echo off
title DEPLOY AUTOMATICO
color 0A

set REPO_URL=https://github.com/ponchocarloncho-debug/meplay-plantilla.git
set BRANCH=main

echo =====================================
echo            DEPLOY
echo =====================================
echo.

if not exist ".git" (
    echo Inicializando repositorio...
    git init
    git branch -M %BRANCH%
    git remote add origin "%REPO_URL%"
)

echo.
echo Cambiando a rama main...
git checkout %BRANCH%

echo.
echo Agregando archivos...
git add -A

echo.
echo Verificando cambios...
git diff --cached --quiet
if %errorlevel%==0 (
    echo.
    echo No hay cambios para subir.
    goto FIN
)

echo.
echo Haciendo commit...
git commit -m "Actualizacion automatica"

echo.
echo Subiendo a GitHub...
git push -u origin %BRANCH%

:FIN
echo.
echo =====================================
echo        PROCESO TERMINADO
echo =====================================
echo.
pause
