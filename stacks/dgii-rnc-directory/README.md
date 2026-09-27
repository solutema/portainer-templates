# DGII RNC Directory

Stack para desplegar la API `dgii-rnc-directory` con PostgreSQL inicializado desde un snapshot existente.

La imagen PostgreSQL restaura el dump solo cuando el volumen `/var/lib/postgresql/data` está vacío. Después del primer arranque, la API sigue usando esa misma base y puede continuar sincronizando, descargando y actualizando los datos mediante sus tareas programadas.

## Imágenes

- `gitea.joseagrc.com/joseagrc/dgii-rnc-directory-api`
- `gitea.joseagrc.com/joseagrc/dgii-rnc-directory-postgresql`
