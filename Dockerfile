FROM php:8.2-apache-bookworm AS php-base

RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu-dev libonig-dev libpq-dev libzip-dev unzip \
    && docker-php-ext-install -j$(nproc) bcmath intl mbstring opcache pdo_pgsql zip \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

FROM php-base AS backend-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY . .
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-ansi

FROM node:22.16.0-bookworm-slim AS frontend

WORKDIR /app
COPY package.json package-lock.json tsconfig.json vite.config.ts vitest.config.ts ./
COPY resources ./resources
COPY public ./public
COPY --from=backend-deps /var/www/html/vendor ./vendor
RUN npm ci --no-audit && npm run build

FROM php-base AS runtime

WORKDIR /var/www/html
COPY --chown=www-data:www-data . .
COPY --from=backend-deps --chown=www-data:www-data /var/www/html/vendor ./vendor
COPY --from=frontend --chown=www-data:www-data /app/public/build ./public/build
COPY docker/apache.conf /etc/apache2/sites-available/recetaria.conf
RUN a2dissite 000-default \
    && a2ensite recetaria \
    && sed -i 's/Listen 80/Listen 10000/' /etc/apache2/ports.conf \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000
CMD ["apache2-foreground"]
