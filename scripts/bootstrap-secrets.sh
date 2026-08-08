#!/usr/bin/env bash
# Crea/actualiza el Secret `enruta-env` en el namespace `enruta`.
#
# El DSN se lee del Secret que CNPG ya gestiona (nunca se escribe a mano) y las
# credenciales compartidas del ecosistema (SendGrid, gateway IA) se copian del
# Secret de `remates`, que es donde están las probadas en producción.
#
# Ejecutar una vez al dar de alta el entorno, y cada vez que rote una credencial:
#   ./scripts/bootstrap-secrets.sh
#
# No imprime ningún secreto por stdout.
set -euo pipefail

NS=enruta
ORIGEN_NS=remates
ORIGEN_SECRET=remates-env

req() {   # req <ns> <secret> <clave>  -> valor en claro por stdout
  kubectl get secret "$2" -n "$1" -o "jsonpath={.data.$3}" | base64 -d
}

echo "== leyendo DSN del Secret gestionado por CNPG =="
PW_DB="$(req databases enruta-db-secret password)"

echo "== copiando credenciales compartidas desde $ORIGEN_NS/$ORIGEN_SECRET =="
SENDGRID="$(req "$ORIGEN_NS" "$ORIGEN_SECRET" SENDGRID_API_KEY)"
AI_KEY="$(req   "$ORIGEN_NS" "$ORIGEN_SECRET" AI_GATEWAY_KEY)"

# AUTH_SECRET y DEMO_PASSWORD se conservan si el Secret ya existe: rotar
# AUTH_SECRET invalidaría todas las sesiones JWT abiertas, y DEMO_PASSWORD
# debe seguir calzando con lo que sembró el seed.
existente() { kubectl get secret enruta-env -n "$NS" -o "jsonpath={.data.$1}" 2>/dev/null | base64 -d 2>/dev/null || true; }
AUTH_SECRET="$(existente AUTH_SECRET)";     [ -n "$AUTH_SECRET" ] || AUTH_SECRET="$(openssl rand -base64 32)"
DEMO_PASSWORD="$(existente DEMO_PASSWORD)"; [ -n "$DEMO_PASSWORD" ] || DEMO_PASSWORD="$(openssl rand -base64 18)"

kubectl -n "$NS" create secret generic enruta-env \
  --from-literal=DATABASE_URL="postgresql://enruta:${PW_DB}@pg-shared-rw.databases.svc.cluster.local:5432/enruta" \
  --from-literal=AUTH_SECRET="$AUTH_SECRET" \
  --from-literal=AUTH_URL="https://enruta.aquedra.com" \
  --from-literal=NEXTAUTH_URL="https://enruta.aquedra.com" \
  --from-literal=DEMO_PASSWORD="$DEMO_PASSWORD" \
  --from-literal=SMTP_HOST="smtp.sendgrid.net" \
  --from-literal=SMTP_PORT="587" \
  --from-literal=SMTP_USER="apikey" \
  --from-literal=SMTP_PASS="$SENDGRID" \
  --from-literal=SMTP_FROM="ENRUTA <noreply@aquedra.com>" \
  --from-literal=AI_BASE_URL="https://ai.creaciv.com/v1" \
  --from-literal=AI_API_KEY="$AI_KEY" \
  --from-literal=AI_MODEL="creaciv/deepseek-v4-pro" \
  --dry-run=client -o yaml | kubectl apply -f -

echo
echo "Listo. Claves escritas en $NS/enruta-env:"
kubectl -n "$NS" get secret enruta-env -o go-template='{{range $k,$v := .data}}  - {{$k}}{{"\n"}}{{end}}'
