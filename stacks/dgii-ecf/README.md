# DGII e-CF — producción reproducible

Este template reproduce el Compose activo de producción en Solutema. Usa
PostgreSQL, Redis, PgBouncer, dos réplicas de API, workers de cola, portal,
renderer, tareas de respaldo y health checks.

## Entradas obligatorias

Portainer debe solicitar y conservar fuera de Git:

- `POSTGRES_PASSWORD`, `REDIS_PASSWORD` y `PGADMIN_DEFAULT_PASSWORD`
- `CERT_MASTER_KEY_BASE64`, `INTERNAL_API_TOKEN`, `API_KEY_PEPPER` y `APP_JWT_SECRET`
- `PRINT_RENDERER_INTERNAL_TOKEN` e `INSTANCE_BACKUP_AGENT_TOKEN`
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`
- dominios, CORS y las credenciales SMTP/backup que correspondan al entorno

No incluya secretos en el repositorio ni en la definición versionada del stack.

## Contrato de dominios

Los cinco valores siguientes deben mantenerse coherentes. En Solutema son:

| Variable | Valor de producción |
| --- | --- |
| `ENGINE_DOMAIN` | `ecf.solutema.com` |
| `PUBLIC_ENGINE_URL` | `ecf.solutema.com` |
| `PORTAL_DOMAIN` | `app.solutema.com` |
| `PORTAL_PUBLIC_URL` | `https://app.solutema.com` |
| `CORS_ALLOWED_ORIGINS` | `https://app.solutema.com` |

No despliegue el stack con dominios de ejemplo ni variables de validación. Un
`ENGINE_DOMAIN` distinto de `PUBLIC_ENGINE_URL` deja al portal apuntando a un
router inexistente y el navegador lo muestra como **Network Error** durante el
inicio de sesión. Antes de redeploy, confirme esos valores en el formulario de
variables de Portainer.

## Valores operativos de producción para `1.2.0`

- Engine, portal y print-renderer: `1.2.0`.
- PgBouncer: `edoburu/pgbouncer:1.22.1-p0`, modo `transaction`, autenticación
  `scram-sha-256`, `MAX_CLIENT_CONN=250`, `DEFAULT_POOL_SIZE=35` y
  `MAX_DB_CONNECTIONS=45`.
- `INSTANCE_BACKUP_WORK_DIR=/data/_instance-backup-work`. Debe estar en un
  volumen compartido por la API/engine y `dgii-ecf-backup-automation`; si se usa
  `/tmp`, ambos contenedores deben montar exactamente el mismo bind mount o la
  API no podrá entregar el archivo generado.
- Las réplicas de engine, scheduler y workers usan `pgbouncer:5432`; las
  migraciones deben conectarse directamente a PostgreSQL.
- Los artefactos usan `ARTIFACT_STORAGE_BACKEND=filesystem` y el volumen
  `dgii_ecf_engine_data` compartido por los procesos de engine. Para más de un
  host, configure `s3` o `dual` y las variables `ARTIFACT_S3_*`.
- Mantenga `HA_MODE_ENABLED=false` mientras `ARTIFACT_STORAGE_BACKEND` sea
  `filesystem`. Active HA solo después de configurar almacenamiento compartido
  real, preferiblemente S3.
- Chromium/PDF pertenece únicamente a `dgii-ecf-print-renderer`. El portal y el
  engine no deben declarar `CHROMIUM_PATH` ni fallback local de PDF.

## Despliegue

Ejecute primero el perfil `dgii-ecf-migrate` cuando exista una migración
pendiente. Después despliegue el stack normal y espere que PostgreSQL, Redis,
PgBouncer, renderer, engine, workers y portal indiquen `healthy`.
