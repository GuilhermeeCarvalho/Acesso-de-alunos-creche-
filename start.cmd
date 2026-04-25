@echo off
REM 🚀 SCRIPT DE INICIALIZAÇÃO RÁPIDA - Sistema Controle de Alunos (Windows)

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      🚀 INICIANDO SISTEMA - CONTROLE DE ALUNOS             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar Docker
echo [INFO] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [✗] Docker não está instalado
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
echo [✓] Docker detectado: %DOCKER_VERSION%

REM Verificar Docker Compose
echo [INFO] Verificando Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [✗] Docker Compose não está instalado
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('docker-compose --version') do set COMPOSE_VERSION=%%i
echo [✓] Docker Compose detectado: %COMPOSE_VERSION%

REM Criar .env se não existir
echo [INFO] Verificando arquivo .env...
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [✓] .env criado a partir de .env.example
    ) else (
        echo [✗] .env.example não encontrado
        pause
        exit /b 1
    )
) else (
    echo [✓] .env já existe
)

REM Criar diretórios
echo [INFO] Criando diretórios de persistência...
if not exist "backend\postgres_data" mkdir backend\postgres_data
if not exist "backend\logs" mkdir backend\logs
echo [✓] Diretórios criados

REM Limpar containers antigos
echo [INFO] Removendo containers antigos...
docker-compose down --remove-orphans >nul 2>&1

REM Build
echo [INFO] Build das imagens Docker...
docker-compose build --no-cache
if errorlevel 1 (
    echo [✗] Erro no build
    pause
    exit /b 1
)

REM Iniciar
echo [INFO] Inicializando containers...
docker-compose up -d
if errorlevel 1 (
    echo [✗] Erro ao iniciar containers
    pause
    exit /b 1
)

REM Aguardar
echo [INFO] Aguardando inicialização dos serviços... (30-60 segundos)
timeout /t 5 /nobreak

REM Status
echo [INFO] Verificando status dos containers...
echo.
docker-compose ps
echo.

REM Sucesso
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║               ✅ SISTEMA INICIADO COM SUCESSO               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📍 Serviços disponíveis em:
echo    • Frontend:  http://localhost:5173
echo    • Backend:   http://localhost:8080
echo    • Banco:     localhost:5432
echo.
echo 📋 Comandos úteis:
echo    • Ver logs:       docker-compose logs -f
echo    • Parar:          docker-compose stop
echo    • Reiniciar:      docker-compose restart
echo    • Remover tudo:   docker-compose down -v
echo.
echo 🔗 Para conectar ao PostgreSQL:
echo    docker-compose exec postgres psql -U postgres -d creche
echo.
pause
