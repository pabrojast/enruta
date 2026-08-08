# ENRUTA — Descubre tu norte

Plataforma web de orientación vocacional para estudiantes de 1° a 4° medio en Chile.

MVP con **recorrido vertical funcional**:

Registro con código → Perfil → Cuestionario → Procesamiento → Borrador de informe → Revisión profesional → Entrega → Exploración de alternativas.

## Requisitos

- Node.js 22+
- pnpm 10+
- Docker (para PostgreSQL)

## Instalación rápida (local)

```bash
# 1. Variables de entorno
cp .env.example .env

# 2. Base de datos (Postgres en puerto 5433 para no chocar con otros servicios locales)
docker compose up -d db

# 3. Dependencias
pnpm install

# 4. Migraciones + datos demo
pnpm db:generate   # si aún no hay carpeta drizzle/
pnpm db:setup      # migrate + seed

# 5. App
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Credenciales demo

Contraseña **local** para todos los usuarios demo: `EnrutaDemo2026!` (el valor
de `DEMO_PASSWORD`). En producción esa contraseña se rota y no se publica: la
demo se explora con los botones **"Explorar la demo"** de la página de login.

| Rol | Correo |
|-----|--------|
| Admin ENRUTA | `admin@enruta.cl` |
| Orientadora HC | `orientador@losandes.cl` |
| Psicólogo HC | `psicologo@losandes.cl` |
| UTP | `utp@losandes.cl` |
| Profesor jefe | `profesor@losandes.cl` |
| Orientadora TP | `orientador@valleverde.cl` |
| Estudiante 3° HC (Sofía) | `sofia.estudiante@demo.cl` |
| Estudiante 2° HC | `mateo.estudiante@demo.cl` |
| Estudiante 1° HC | `valentina.estudiante@demo.cl` |
| Estudiante 4° HC | `benjamin.estudiante@demo.cl` |
| Estudiante 3° TP | `isidora.tp@demo.cl` |
| Estudiante 4° TP | `tomas.tp@demo.cl` |
| Apoderada Sofía | `apoderado.sofia@demo.cl` |
| Partner agro | `partner@agroelroble.cl` |

### Códigos de registro colegio

- `HC-DEMO` — Liceo Los Andes HC  
- `TP-DEMO` — Liceo Agropecuario Valle Verde TP  

## Recorrido sugerido de demo

1. Login como `sofia.estudiante@demo.cl` → completar perfil si hace falta → cuestionario → enviar.
2. Logout → login `orientador@losandes.cl` → Informes → Validar y entregar.
3. Volver como Sofía → ver informe → explorar → guardar alternativas → comparar.
4. Login `utp@losandes.cl` → ver indicadores agregados.

## Scripts

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Desarrollo |
| `pnpm build` / `pnpm start` | Producción |
| `pnpm db:generate` | Genera migraciones Drizzle |
| `pnpm db:migrate` | Aplica migraciones |
| `pnpm db:seed` | Datos demo (idempotente: limpia y recrea) |
| `pnpm db:setup` | migrate + seed |
| `pnpm db:ensure-reports` | Asegura informes demo (Sofía pending / Benjamín delivered) sin reseed completo |
| `pnpm test:unit` | Tests unitarios (scoring, informes, quiz, caseload…) |
| `pnpm test:smoke` | Smoke de integridad contra la BD demo |
| `pnpm test:e2e` | Playwright (app en :3000): público, roles demo, entrega de informe |
| `pnpm test:scoring` | Tests del motor de puntajes |

## Docker (app + db)

```bash
docker compose up -d db
pnpm db:setup
# desarrollo con next en host:
pnpm dev

# o build de imagen web (tras migrar/seed):
# docker compose up --build
```

## Módulos ampliados

| Módulo | Ruta |
|--------|------|
| Constructor cuestionarios | `/admin/cuestionarios` |
| Planes y flags | `/admin/planes` |
| Integraciones (SMTP outbox, MINEDUC stub) | `/admin/integraciones` |
| Diagnóstico PEI/PME | `/colegio/diagnostico` |
| PDF informe / proyecto de vida | botones en `/app/informe` y `/app/proyecto-de-vida` |
| Juegos | `/app/juegos` |
| Autorización familiar OTP | `/autorizar-familia` |
| Partner materiales | `/partner/eventos` |
| Análisis estudiante (datos públicos) | `/app/analisis` |
| Análisis colegio × mercado | `/colegio/analisis` |
| Catálogo de fuentes públicas | `/admin/datos-publicos` |

### Datos públicos de referencia

El seed carga indicadores inspirados en:

- **INE** — Encuesta Nacional de Empleo (estructura sectorial)
- **SIES / Mi Futuro** — áreas formativas y rutas ES
- **MINEDUC Datos Abiertos** — contexto educativo

Documentación: `data/public/README.md`. Los valores son **agregados orientativos** con fuente y año en la UI; no reemplazan las series oficiales.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [API / Actions](docs/API.md)
- [Decisiones técnicas](docs/DECISIONS.md)
- [Pendientes / roadmap](docs/PENDING.md)
- [Migración Supabase](docs/SUPABASE.md)

## Identidad visual

Logo oficial: `public/brand/enruta-logo.jpg`

## Principios de producto

- Resultados **orientativos**, no diagnósticos.
- Recomendaciones **explicables**.
- Mediación humana en informes.
- Separación de datos por establecimiento.
- Lenguaje cercano en español de Chile.
