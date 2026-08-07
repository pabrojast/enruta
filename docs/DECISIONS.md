# Decisiones técnicas — ENRUTA MVP

| Decisión | Elección | Razón |
|----------|----------|--------|
| Framework | Next.js 15 App Router | Un solo deploy, RSC, Server Actions |
| Auth | Auth.js (next-auth v5) credentials | Sin depender de Supabase Cloud en el MVP local |
| DB | PostgreSQL 16 + Drizzle ORM | Tipado, migraciones SQL, Docker simple |
| Multi-tenant | `school_id` + checks en servidor | Aislamiento de datos entre colegios |
| Scoring | RIASEC-inspirado propio | Sin instrumentos con licencia |
| IA | Plantillas determinísticas | Explicable, sin diagnóstico, sin costo |
| UI | Tailwind 4 + design tokens del logo | Identidad neón / brújula |
| Deploy | Docker Compose (db + opcional web standalone) | Reproducible en local |

## Roadmap a Supabase

1. Migrar Auth a Supabase Auth manteniendo tabla `users`/`profiles`.
2. Aplicar RLS equivalentes a los checks actuales de `school_id` y asignaciones.
3. Usar Storage para evidencias del portafolio.
