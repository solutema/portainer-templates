# Tryton 8.0 LTS

Template basado en la rama `8.0` de
[`tryton-do/docker-tryton`](https://code.unpaismejor.org.do/tryton-do/docker-tryton).

## Requisitos de despliegue

- Cree previamente una red Docker externa para el proxy, por ejemplo:
  `docker network create proxy`.
- Publique `tryton-web:8000` y `tryton-bus:8000` únicamente mediante un proxy
  inverso con HTTPS. El template no publica puertos directamente en el host.
- Use contraseñas aleatorias, diferentes y de al menos 32 caracteres para
  `DB_PASSWORD` y `ADMIN_PASSWORD`. Portainer las almacena como variables del
  stack; restrinja el acceso administrativo al entorno y a sus respaldos.
- Ajuste `TRYTON_NUM_PROXIES` al número exacto de proxies de confianza entre el
  cliente y Tryton. No lo aumente innecesariamente.
- Mantenga `PUBLIC_URL` en HTTPS y con `/` al final.

PostgreSQL solo participa en una red interna y no queda accesible desde la red
del proxy. Los procesos de Tryton se ejecutan con el usuario no privilegiado de
la imagen, sin capacidades Linux adicionales y con `no-new-privileges`.

## Persistencia y recuperación

El stack crea volúmenes separados para PostgreSQL, archivos adjuntos y copias
de seguridad. `tryton-backup` genera respaldos periódicos en
`tryton-backups`; cópielos además a almacenamiento externo, cifrado y con
control de acceso. Pruebe periódicamente una restauración en un entorno
aislado: un respaldo no verificado no constituye un plan de recuperación.

## Actualizaciones

La imagen usa la etiqueta mantenida `8.0` y `pull_policy: always`. Antes de
actualizar producción, cree un respaldo, pruebe la nueva imagen en un entorno
separado y conserve un procedimiento de reversión. El servicio de migración se
ejecuta antes de iniciar los procesos web y de trabajo.
