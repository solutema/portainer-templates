# WordPress

Plantilla de WordPress basada en la imagen mantenida por
[`joseagrc/docker-wordpress`](https://gitea.joseagrc.com/joseagrc/docker-wordpress).

## Valores requeridos

- `SITE_URL`: dominio sin protocolo ni prefijo `www`, por ejemplo `blog.example.com`.
- `ROOT_PASS`, `DB_PASS` y `ADMIN_PASS`: contraseñas largas y únicas.
- `ADMIN_EMAIL`: correo del administrador inicial.

La plantilla publica WordPress en `SITE_URL` y `www.SITE_URL`; phpMyAdmin queda
en `pma.SITE_URL`. MariaDB permanece exclusivamente en la red interna. Requiere
una red externa de Traefik, cuyo nombre predeterminado es `proxy`.

La imagen predeterminada es `gitea.joseagrc.com/joseagrc/wordpress` y el tag es
`php8.4-6.9.4-alpine-3.23`. Configure el registro de Gitea en Portainer si el
entorno no dispone ya de credenciales para extraer imágenes privadas.
