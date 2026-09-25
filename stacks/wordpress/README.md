# WordPress

Plantilla de WordPress basada en la imagen mantenida por
[`joseagrc/docker-wordpress`](https://gitea.joseagrc.com/joseagrc/docker-wordpress).

## Valores requeridos

- `DOMAIN`: dominio base sin protocolo ni prefijo `www`, por ejemplo `example.com`.
- `SITE_URL`: dominio canonico de WordPress sin protocolo, por ejemplo
  `www.example.com`.
- `ROOT_PASS`, `DB_PASS` y `ADMIN_PASS`: contraseñas largas y únicas.
- `ADMIN_EMAIL`: correo del administrador inicial.

La plantilla publica WordPress en `DOMAIN` y `www.DOMAIN`; phpMyAdmin queda en
`pma.DOMAIN`. MariaDB permanece exclusivamente en la red interna. Requiere una
red externa de Traefik, cuyo nombre predeterminado es `proxy`.

La plantilla incluye Redis interno para cache de objetos. Al activar el plugin
Redis Object Cache, configure WordPress para usar `redis:6379`, no
`127.0.0.1:6379`. Valores recomendados en `wp-config.php`:

```php
define( 'WP_REDIS_HOST', 'redis' );
define( 'WP_REDIS_PORT', 6379 );
define( 'WP_REDIS_DATABASE', 0 );
define( 'WP_REDIS_TIMEOUT', 1 );
define( 'WP_REDIS_READ_TIMEOUT', 1 );
define( 'WP_REDIS_PREFIX', 'wordpress:' );
define( 'WP_REDIS_CLIENT', 'phpredis' );
```

La imagen predeterminada es `gitea.joseagrc.com/joseagrc/wordpress` y el tag es
`php8.4-6.9.4-alpine-3.23`. Configure el registro de Gitea en Portainer si el
entorno no dispone ya de credenciales para extraer imágenes privadas.
