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

### Comandos uteis

Parar o ambiente:

```bash
docker-compose down
```

Ver logs:

```bash
docker-compose logs -f
```
