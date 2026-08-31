# Tryton 8.0 LTS

Template basado en la rama `8.0` de
[`tryton-do/docker-tryton`](https://code.unpaismejor.org.do/tryton-do/docker-tryton).

## Requisitos de despliegue

- Cree previamente una red Docker externa para el proxy, por ejemplo:
  `docker network create proxy`.
- Traefik debe estar conectado a esa red y tener habilitado el proveedor Docker.
  El template crea routers TLS para `tryton-web:8000` y para la ruta autenticada
  `/<base-de-datos>/bus` en `tryton-bus:8000`. No publica puertos en el host.
- Defina `TRYTON_HOST` una sola vez y sin protocolo, por ejemplo
  `tryton.example.com`. Compose construye automáticamente la URL completa
  `https://tryton.example.com/` que Tryton anuncia para el bus.
- Indique el entrypoint HTTPS y el certificate resolver que ya existan en
  Traefik. Los valores comunes son `websecure` y `letsencrypt`, respectivamente.
- Use contraseñas aleatorias, diferentes y de al menos 32 caracteres para
  `DB_PASSWORD` y `ADMIN_PASSWORD`. Portainer las almacena como variables del
  stack; restrinja el acceso administrativo al entorno y a sus respaldos.
- Ajuste `TRYTON_NUM_PROXIES` al número exacto de proxies de confianza entre el
  cliente y Tryton. No lo aumente innecesariamente.
- Las etiquetas habilitan HSTS, `nosniff` y una política de referencia
  restrictiva.

## Configuración completa de Tryton

El formulario de Portainer expone las 73 opciones fijas de configuración del
servidor Tryton 8.0 que utiliza esta imagen. Incluye las secciones `web`,
`database`, `request`, `cache`, `cron`, `queue`, `error`, `ssl`, `email`,
`session`, `password`, `attachment`, `bus`, `report` y `html`. Cada campo tiene
el valor efectivo predeterminado de la imagen y puede modificarse antes de
desplegar o al actualizar el stack.

Los campos de URL pública, CORS, idioma, conexiones y proxies conservan la
compatibilidad con `TRYTON_HOST`, `DB_LANGUAGE`, `TRYTON_DATABASE_MINCONN`,
`TRYTON_DATABASE_MAXCONN` y `TRYTON_NUM_PROXIES`. Su sobreescritura oficial
`TRYTOND_<SECCION>__<OPCION>` queda vacía de forma predeterminada y solo toma
prioridad cuando el operador introduce un valor explícito.

Tryton también admite secciones con claves dinámicas, por ejemplo `table`,
`table_query_materialized` y las configuraciones particulares de módulos o de
middleware WSGI. No existe una lista finita de nombres para esas claves. Se
pueden agregar al editor del stack siguiendo la sintaxis:

```yaml
environment:
  TRYTOND_TABLE__ACCOUNT.INVOICE.LINE: nombre_tabla_personalizado
  TRYTOND_NOMBRE_MODULO__OPCION: valor
```

La imagen genera `/tmp/trytond.conf` durante cada arranque. Las variables
`TRYTOND_<SECCION>__<OPCION>` reemplazan la opción correspondiente del archivo
base; las opciones no sobrescritas permanecen intactas.

PostgreSQL solo participa en una red interna y no queda accesible desde la red
del proxy. Los procesos de Tryton se ejecutan con el usuario no privilegiado de
la imagen, sin capacidades Linux adicionales y con `no-new-privileges`.

El servicio utiliza PostgreSQL `18.6-alpine` y monta el volumen persistente en
`/var/lib/postgresql`, como requieren las imágenes oficiales desde PostgreSQL
18. No cambie el destino nuevamente a `/var/lib/postgresql/data`; esa ruta solo
es compatible con las imágenes anteriores.

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
ejecuta antes del bootstrap y este debe terminar correctamente antes de iniciar
los procesos web y de trabajo.

## Inicialización automática

`tryton-bootstrap` activa los módulos indicados en `TRYTON_MODULES`, importa
los catálogos ISO de países y monedas y crea la empresa. La operación es
idempotente, por lo que actualizar el stack no duplica la empresa.

```text
TRYTON_MODULES=company country currency party party_do currency_do
IMPORT_COUNTRIES=true
IMPORT_CURRENCIES=true
COMPANY_NAME=Mi Empresa SRL
COMPANY_TAX_IDENTIFIER=131000000
COMPANY_COUNTRY_CODE=DO
COMPANY_CURRENCY_CODE=DOP
COMPANY_TIMEZONE=America/Santo_Domingo
```

También se pueden definir `COMPANY_STREET`, `COMPANY_CITY` y
`COMPANY_POSTAL_CODE`. Si `COMPANY_NAME` queda vacío se activan los módulos y
se importan los catálogos, pero se omite la creación de la empresa.
