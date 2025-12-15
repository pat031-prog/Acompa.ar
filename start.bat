@echo off
REM Script para iniciar ACompañ.Ar en Windows
echo ========================================
echo    ACompañ.Ar - Inicio del Servidor
echo ========================================
echo.

REM Verificar si existe Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado.
    echo Por favor instala Node.js desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Verificar si existe el archivo .env.local
if not exist .env.local (
    echo ADVERTENCIA: No se encontro el archivo .env.local
    echo.
    echo Copiando .env.local.example a .env.local...
    copy .env.local.example .env.local >nul
    echo.
    echo IMPORTANTE: Edita el archivo .env.local y agrega tu API key de Gemini
    echo Obten tu API key en: https://aistudio.google.com/apikey
    echo.
    echo Presiona cualquier tecla para abrir .env.local en el Bloc de notas...
    pause >nul
    notepad .env.local
    echo.
    echo Una vez que hayas configurado tu API key, presiona cualquier tecla para continuar...
    pause >nul
)

REM Verificar si existe node_modules
if not exist node_modules (
    echo Instalando dependencias...
    echo Esto puede tomar unos minutos la primera vez...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Fallo la instalacion de dependencias
        pause
        exit /b 1
    )
    echo.
    echo Dependencias instaladas correctamente!
    echo.
)

REM Iniciar el servidor de desarrollo
echo Iniciando servidor de desarrollo...
echo.
echo La aplicacion estara disponible en: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
call npm run dev

pause
