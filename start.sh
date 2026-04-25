#!/bin/bash
# 🚀 SCRIPT DE INICIALIZAÇÃO RÁPIDA - Sistema Controle de Alunos

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║      🚀 INICIANDO SISTEMA - CONTROLE DE ALUNOS             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para print colorido
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# 1. Verificar Docker
print_status "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    print_error "Docker não está instalado"
    exit 1
fi
print_success "Docker detectado: $(docker --version)"

# 2. Verificar Docker Compose
print_status "Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose não está instalado"
    exit 1
fi
print_success "Docker Compose detectado: $(docker-compose --version)"

# 3. Criar .env se não existir
print_status "Verificando arquivo .env..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp ".env.example" ".env"
        print_success ".env criado a partir de .env.example"
    else
        print_error ".env.example não encontrado"
        exit 1
    fi
else
    print_success ".env já existe"
fi

# 4. Criar diretórios de volume
print_status "Criando diretórios de persistência..."
mkdir -p backend/postgres_data
mkdir -p backend/logs
print_success "Diretórios criados"

# 5. Limpar containers antigos (opcional)
print_warning "Removendo containers e redes antigas..."
docker-compose down --remove-orphans 2>/dev/null || true

# 6. Build imagens
print_status "Build das imagens Docker..."
docker-compose build --no-cache

# 7.Iniciar containers
print_status "Inicializando containers..."
docker-compose up -d

# 8. Aguardar inicialização
print_status "Aguardando inicialização dos serviços... (30-60 segundos)"
sleep 5

# 9. Verificar status
print_status "Verificando status dos containers..."
echo ""
docker-compose ps
echo ""

# 10. Verificar saúde
print_status "Validando conectividade..."

# Backend
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    print_success "Backend está respondendo"
else
    print_warning "Backend ainda está inicializando..."
fi

# Frontend
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    print_success "Frontend está acessível"
else
    print_warning "Frontend ainda está inicializando..."
fi

# Database
if docker exec creche_db pg_isready -U postgres > /dev/null 2>&1; then
    print_success "PostgreSQL está pronto"
else
    print_warning "PostgreSQL ainda está inicializando..."
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║               ✅ SISTEMA INICIADO COM SUCESSO               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Serviços disponíveis em:"
echo "   • Frontend:  ${BLUE}http://localhost:5173${NC}"
echo "   • Backend:   ${BLUE}http://localhost:8080${NC}"
echo "   • Banco:     ${BLUE}localhost:5432${NC}"
echo ""
echo "📋 Comandos úteis:"
echo "   • Ver logs:       ${YELLOW}docker-compose logs -f${NC}"
echo "   • Parar:          ${YELLOW}docker-compose stop${NC}"
echo "   • Reiniciar:      ${YELLOW}docker-compose restart${NC}"
echo "   • Remover tudo:   ${YELLOW}docker-compose down -v${NC}"
echo ""
echo "🔗 Para conectar ao PostgreSQL:"
echo "   docker-compose exec postgres psql -U postgres -d creche"
echo ""
print_status "Para mais informações, consulte DOCKER_SETUP.md"
echo ""
