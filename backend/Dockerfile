# Stage 1: Build Stage (Builder)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copiar arquivos de configuração do Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Copiar código-fonte
COPY src src

# Build da aplicação (skip tests para velocidade)
RUN ./mvnw clean package -DskipTests -q

# Stage 2: Runtime Stage (Multi-stage build - reduz tamanho da imagem)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar apenas o JAR gerado do builder
COPY --from=builder /build/target/*.jar app.jar

# Criar diretório para logs
RUN mkdir -p /app/logs

# Expor porta da aplicação
EXPOSE 8080

# Health check (verifica se a aplicação está saudável)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Executar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
