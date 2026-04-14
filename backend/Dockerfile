FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
# Isso assume que você vai gerar um .jar do Java depois
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]