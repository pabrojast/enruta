# API y Server Actions — ENRUTA

El MVP privilegia **Server Actions** sobre REST. Auth: sesión cookie Auth.js.

## Auth

| Acción | Descripción |
|--------|-------------|
| `loginAction` | Login email/password |
| `registerStudentAction` | Registro con código de colegio |
| `logoutAction` | Cierra sesión |

Route: `GET/POST /api/auth/[...nextauth]`

## Estudiante

| Acción | Descripción |
|--------|-------------|
| `saveConsentsAction` | Términos + datos |
| `saveProfileAction` | Perfil / autoconocimiento abierto |
| `startOrResumeAssessmentAction` | Inicia o retoma cuestionario |
| `saveAnswerAction` | Auto-save de respuesta |
| `submitAssessmentAction` | Scoring + informe pending_review + alerta |
| `addPortfolioReflectionAction` | Portafolio |
| `saveLifeProjectAction` | Proyecto de vida |
| `toggleSaveAlternativeAction` | Guardar/quitar alternativa |
| `registerEventAction` | Inscripción a evento |

## Profesional

| Acción | Descripción |
|--------|-------------|
| `validateReportAction` | Validar/entregar o devolver borrador |
| `updateAlertStatusAction` | open / in_progress / closed |
| `markAttendanceAction` | Asistencia a eventos |

## Seguridad

- Middleware protege `/app`, `/pro`, `/colegio`, `/admin` por rol.
- Informes solo visibles al estudiante en estado `delivered` | `updated`.
- Checks de `school_id` y asignaciones en acciones sensibles.
