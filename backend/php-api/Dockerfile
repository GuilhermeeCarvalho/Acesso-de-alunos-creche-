FROM php:8.2-apache
# Instala extensões para o PHP falar com o Postgres
RUN apt-get update && apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql
COPY . /var/www/html/
EXPOSE 80