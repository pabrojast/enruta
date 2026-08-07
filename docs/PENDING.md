# Estado de funcionalidades

## Completado (MVP ampliado)

### Núcleo
- Vertical slice estudiante → informe → exploración
- Multi-rol (estudiante, profesional, colegio, admin, familia, partner)
- Seed demo HC/TP

### Continuación 1
- CSV indicadores institucionales
- Admin crear establecimientos/usuarios
- Juego “Un día en la vida…”
- Seguimientos 30/90/180
- Notificaciones in-app
- Portal apoderado y partner
- Recuperación de contraseña (token + outbox)
- Contacto persistido

### Continuación 2
- Constructor de cuestionarios (admin CRUD secciones/preguntas)
- Capa de correo SMTP opcional + email_outbox
- Export PDF informe, proyecto de vida y diagnóstico
- Juegos: decisiones, desafíos de habilidades, ambientes laborales
- Diagnóstico institucional PEI/PME + informe + PDF
- Planes comerciales (Diagnóstico/Piloto/4 Años) + feature flags UI
- PWA: service worker + precache de shell
- Autorización familiar OTP (`/autorizar-familia`)
- Partner: materiales con validación de archivos (antivirus ligero)
- Stub MINEDUC + logs
- Guía Supabase Auth/RLS (`docs/SUPABASE.md`)
- Push subscriptions (persistencia; envío push real requiere VAPID)

### Continuación 3
- **Drag and drop** en constructor de cuestionarios:
  - Reordenar secciones
  - Reordenar preguntas
  - Mover preguntas entre secciones
  - Renombrar sección inline
  - Persistencia inmediata en BD (`order_index`)

### Continuación 4 (producto + confianza)
- Home / marketing y engagement estudiante (espera, TL;DR, `/descubrir`)
- Catálogo con métricas Chile (MiFuturo/INE) + fuentes en UI
- Caseload profesional, cola de informes, reunión 20 min, dashboard colegio por curso
- Notificación + email outbox al entregar informe
- Páginas `/privacidad` y `/terminos` enlazadas desde consentimiento y footer
- Admin CRUD catálogo con métricas y fuentes
- Preview del cuestionario (vista estudiante) en admin

## Mejoras futuras (no bloquean el MVP)

- Envío Web Push real con claves VAPID y worker de notificaciones
- Integración MINEDUC productiva (APIs oficiales + credenciales)
- Antivirus externo (ClamAV) en uploads
- Supabase Auth + RLS en un entorno de staging real
- Billing/pasarela de pago
- Offline completo de cuestionarios con sync conflict resolution
- Firma digital avanzada de consentimientos (eID / DocuSign)
- Import automático / sync de series MiFuturo
- Suite unitaria + smoke DB: `pnpm test:unit` y `pnpm test:smoke`
- E2E Playwright (11 specs): `pnpm test:e2e` con app en :3000
  - público, estudiante, pro (caseload/cola), colegio UTP
  - entrega de informe: pro valida → estudiante ve TL;DR
- Seed con informes demo (Sofía pending, Benjamín delivered)
  - parche rápido: `pnpm db:ensure-reports`
