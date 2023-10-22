#syntax=docker/dockerfile:1.4

FROM php:8.2-fpm-alpine AS php_upstream
FROM mlocati/php-extension-installer:2 AS php_extension_installer_upstream
FROM composer/composer:2-bin AS composer_upstream
FROM caddy:2-alpine AS caddy_upstream

FROM php_upstream AS php_base

WORKDIR /srv/app

RUN apk add --no-cache \
  acl \
  fcgi \
  file \
  gettext \
  git \
  ;

COPY --from=php_extension_installer_upstream --link /usr/bin/install-php-extensions /usr/local/bin

RUN set -eux; install-php-extensions \
  apcu \
  intl \
  opcache \
  zip \
  ;

COPY --link docker/php/conf.d/app.ini $PHP_INI_DIR/conf.d/

COPY --link docker/php/php-fpm.d/zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf
RUN mkdir -p /var/run/php

COPY --link --chmod=755 docker/php/docker-healthcheck.sh /usr/local/bin/docker-healthcheck
HEALTHCHECK --start-period=1m CMD docker-healthcheck

COPY --link --chmod=755 docker/php/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]
CMD ["php-fpm"]

ENV COMPOSER_ALLOW_SUPERUSER=1
ENV PATH="${PATH}:/root/.composer/vendor/bin"

COPY --from=composer_upstream --link /composer /usr/bin/composer

FROM php_base AS php_dev

ENV APP_ENV=dev XDEBUG_MODE=off
# VOLUME /srv/app/var/

RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

RUN set -eux; install-php-extensions \
  xdebug \
  ;

COPY --link docker/php/conf.d/docker-php-ext-xdebug.ini $PHP_INI_DIR/conf.d/

FROM caddy_upstream AS caddy_base

