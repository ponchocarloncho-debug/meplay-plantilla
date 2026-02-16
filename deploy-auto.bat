@echo off
cd /d "%~dp0"

echo =====================================
echo        DEPLOY AUTOMATICO
echo =====================================
echo.

git branch -M main
git add -A
git commit -m "Actualizacion automatica"
git push origin main --force

echo.
echo =====================================
echo          FINALIZADO
echo =====================================
pause
