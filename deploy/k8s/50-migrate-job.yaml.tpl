# Aplicado desde CI con:
#   kubectl -n enruta delete job enruta-migrate --ignore-not-found
#   sed "s|__IMAGE__|ghcr.io/pabrojast/enruta:<sha>-migrate|g" 50-migrate-job.yaml.tpl | kubectl apply -f -
#   kubectl -n enruta wait --for=condition=complete job/enruta-migrate --timeout=300s
apiVersion: batch/v1
kind: Job
metadata:
  name: enruta-migrate
  namespace: enruta
spec:
  backoffLimit: 1
  ttlSecondsAfterFinished: 3600
  template:
    spec:
      restartPolicy: Never
      imagePullSecrets:
        - name: ghcr-pull
      containers:
        - name: migrate
          image: __IMAGE__
          envFrom:
            - secretRef:
                name: enruta-env
          resources:
            requests:
              cpu: 50m
              memory: 256Mi
            limits:
              memory: 512Mi
