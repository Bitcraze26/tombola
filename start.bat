@echo off
echo Avvio della Tombola Napoletana...
echo.
call npm install
echo.
echo Dipendenze controllate. Avvio server...
echo.
call npm run dev -- --host
pause
