# Acesso-de-alunos-creche-

Projeto para controlar horario de entrada e saida de criancas em uma creche.

## Como rodar o projeto

### Requisito

- Docker Desktop instalado e em execucao

### Passo a passo

1. Abra o terminal na raiz do projeto.
2. Execute o comando abaixo para subir frontend, backend e banco de dados:

```bash
docker-compose up -d --build
```

3. Acesse a aplicacao:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui/index.html
   - OpenAPI JSON: http://localhost:8080/v3/api-docs

### Comandos uteis

Parar o ambiente:

```bash
docker-compose down
```

Ver logs:

```bash
docker-compose logs -f
```
