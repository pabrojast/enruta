# Migración a Supabase (Auth + RLS)

El MVP local usa PostgreSQL + Auth.js. Para producción con Supabase:

## 1. Proyecto Supabase
1. Crear proyecto y copiar URL + anon key + service role.
2. Aplicar migraciones SQL de `drizzle/` en el SQL editor (o `supabase db push`).
3. Configurar variables en `.env` (ver `.env.example`).

## 2. Auth
- Reemplazar credentials Auth.js por Supabase Auth (email magic link / password).
- Mantener tabla `users`/`profiles` alineada con `auth.users.id`.

## 3. RLS (políticas mínimas)

```sql
alter table students enable row level security;
alter table vocational_reports enable row level security;
alter table assessment_responses enable row level security;

-- Estudiante ve solo lo propio
create policy student_own_reports on vocational_reports
  for select using (
    student_id in (
      select id from students where user_id = auth.uid()
    )
    and status in ('delivered', 'updated')
  );

-- Staff del mismo school_id
create policy school_staff_students on students
  for select using (
    school_id = (
      select school_id from users where id = auth.uid()
    )
  );
```

Ajustar políticas por rol (`counselor`, `psychologist`, etc.) y asignaciones.

## 4. Storage
- Bucket `portfolio-evidence` con paths `{school_id}/{student_id}/...`
- URLs firmadas; validación de MIME en Edge Function o backend.
