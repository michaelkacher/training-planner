@echo off
REM Kill processes on ports 3000 and 5173/5174/5175

echo ========================================
echo Killing processes on development ports
echo ========================================
echo.

echo Checking for processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 "') do (
    if not "%%a"=="0" (
        echo Found process %%a on port 3000, killing...
        taskkill //F //PID %%a 2>nul
    )
)

echo Checking for processes on port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 "') do (
    if not "%%a"=="0" (
        echo Found process %%a on port 5173, killing...
        taskkill //F //PID %%a 2>nul
    )
)

echo Checking for processes on port 5174...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174 "') do (
    if not "%%a"=="0" (
        echo Found process %%a on port 5174, killing...
        taskkill //F //PID %%a 2>nul
    )
)

echo Checking for processes on port 5175...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5175 "') do (
    if not "%%a"=="0" (
        echo Found process %%a on port 5175, killing...
        taskkill //F //PID %%a 2>nul
    )
)

echo.
echo ========================================
echo Done! Ports should now be available.
echo ========================================
echo.
echo You can now run: npm run dev
echo.
pause
