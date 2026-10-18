# Acesso de alunos da creche

Aplicacao para controlar os horarios de entrada e saida de criancas em uma creche.

## Requisitos

- Docker Desktop instalado e em execucao
- Um arquivo `.env` na raiz, criado a partir de `.env.example`

Configure senhas fortes e os dados reais do Supabase no `.env`. Nunca publique esse arquivo nem compartilhe a chave de servico do Supabase.

## Executar com Docker Compose

Na raiz do projeto:

```powershell
Copy-Item .env.example .env
```

Edite `.env`, defina senhas fortes para `POSTGRES_PASSWORD` e `ADMIN_FIXED_PASSWORD`, gere um `JWT_SECRET` aleatorio com pelo menos 32 bytes e configure `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` e `SUPABASE_BUCKET`. `ADMIN_FIXED_PASSWORD` e aplicada somente a conta `admin@creche.com` na inicializacao; as outras contas, inclusive outros administradores, mantem as senhas que definirem no cadastro. Para manter a senha fixa atual, informe-a em `ADMIN_FIXED_PASSWORD`; se o repositorio ou o historico Git foi publico, troque-a por uma nova senha privada. Para um banco que ja possui dados, `POSTGRES_PASSWORD` precisa corresponder a senha atualmente configurada no PostgreSQL: alterar o arquivo `.env` nao troca automaticamente a senha dentro de um volume existente. Os tokens JWT expiram apos 8 horas; a troca do `JWT_SECRET` tambem invalida os tokens de sessao existentes. Se o frontend estiver em outro dominio, informe-o em `APP_CORS_ALLOWED_ORIGINS` como uma lista separada por virgulas.

Suba os servicos:

```bash
docker compose up -d --build
```

A aplicacao sera servida pelo Nginx com o build de producao do frontend:

- Frontend: http://localhost:5173
- API: encaminhada pelo mesmo dominio para o backend
- Saude da API: http://localhost:5173/actuator/health
- Swagger UI: http://localhost:5173/swagger-ui/index.html

O frontend fica publicado apenas no loopback do host. Configure um proxy reverso com HTTPS para disponibiliza-lo na internet. As portas do backend e do banco nao sao publicadas no host; a API passa pelo proxy interno do Nginx e o banco permanece privado na rede Docker.

## Operacao

Ver logs:

```bash
docker compose logs -f
```

Parar os servicos sem apagar o volume persistente do banco:

```bash
docker compose down
```
