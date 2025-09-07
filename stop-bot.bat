@echo off
echo Stopping Coach Frank Discord Bot...
taskkill /f /im node.exe /t >nul 2>&1
if %errorlevel%==0 (
    echo Bot stopped successfully!
) else (
    echo No bot processes found running.
)
pause
