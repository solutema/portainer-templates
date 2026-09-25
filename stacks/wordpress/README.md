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

La plantilla incluye Redis interno para cache de objetos. Con
`ENABLE_REDIS=TRUE`, la imagen de WordPress configura `wp-config.php`, instala o
activa el plugin Redis Object Cache y ejecuta `wp redis enable`. WordPress debe
usar el host interno `redis:6379`, no `127.0.0.1:6379`.

La imagen predeterminada es `gitea.joseagrc.com/joseagrc/wordpress` y el tag es
`php8.4-6.9.4-alpine-3.23`. Configure el registro de Gitea en Portainer si el
entorno no dispone ya de credenciales para extraer imágenes privadas.
