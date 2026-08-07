# Arquitectura ENRUTA

```
Browser (mobile-first)
   │
   ▼
Next.js App Router
   ├── (public) landing / auth
   ├── /app estudiante
   ├── /pro orientador-psicólogo
   ├── /colegio UTP / profesor jefe
   └── /admin ENRUTA
   │
   ├── Server Actions + Auth.js
   ▼
PostgreSQL (Docker)
   users, schools, students, assessments,
   vocational_reports, catalog_items, events, ...
```

## Flujos críticos

1. **Registro** con `invite_code` → crea `users` + `students`.
2. **Consentimiento** bloquea el dashboard.
3. **Cuestionario** auto-save → submit → `assessment_results` + `vocational_reports(pending_review)` + `alerts`.
4. **Profesional** valida → `delivered` → estudiante ve informe.
5. **Explorador** calcula afinidad explicable vs. dimensiones del estudiante.

## Principios de datos sensibles

- Separación por establecimiento.
- Roles acotados.
- Apoderados no ven respuestas sensibles por defecto.
- Alertas `restricted` solo psicología / admin.
