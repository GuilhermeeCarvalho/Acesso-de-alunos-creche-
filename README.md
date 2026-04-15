# Acesso-de-alunos-creche-
Projeto para controlar horario de entrada e saida de crianças em uma creche 

INSTRUÇÕES PARA RODAR O BACKEND:
-> Requisitos
* Docker instalado
* Java 17+

->Passos
1. Subir o banco
   docker-compose up -d

2. Rodar aplicação
  ./mvnw spring-boot:run


3. Rodar front
   docker run --rm -p 5173:5173 creche-frontend
