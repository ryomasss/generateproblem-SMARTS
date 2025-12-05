@echo off
chcp 65001 >nul
echo ========================================
echo   有机化学反应出题器 - Python 后端服务器
echo ========================================
echo.

echo [环境] 正在激活 Conda 环境: rdkit-env
call D:\Anaconda\Scripts\activate.bat rdkit-env

if errorlevel 1 (
    echo [错误] 无法激活 Conda 环境！
    echo 请检查 D:\Anaconda\Scripts\activate.bat 是否存在。
    pause
    exit /b 1
)

echo [启动] 正在启动 Flask 服务器...
echo [端口] 8000
echo.
echo ----------------------------------------
echo 提示：
echo   1. 浏览器将自动打开应用
echo   2. 如未自动打开，请访问：
echo      http://localhost:8000/random.html
echo   3. 按 Ctrl+C 可停止服务器
echo ----------------------------------------
echo.

:: 启动浏览器（延迟3秒以确保服务器启动）
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:63342/random.html"

:: 启动 Flask 服务器
python server.py
pause
