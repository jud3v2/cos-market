FROM php:8.3-apache
LABEL authors="jud3v"

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    libcurl4-openssl-dev \
    zip \
    unzip \
    default-mysql-client

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip curl intl

# Copy vhost config
COPY docker/config/server/vhost.conf /etc/apache2/sites-available/000-default.conf

COPY . /var/www/laravel

# Enable Apache mods
RUN a2enmod rewrite

# Get latest Composer
RUN php -r "readfile('http://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer

ARG WWW_USER=1000

# Create user
RUN groupadd --force -g $WWW_USER webapp
RUN useradd -ms /bin/bash --no-user-group -g $WWW_USER -u $WWW_USER webapp

RUN chown -R webapp:webapp /var/www/laravel/storage/
RUN chmod -R 775 /var/www/laravel/storage/

# Clean cache
RUN apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

USER ${WWW_USER}
