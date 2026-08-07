# Datos públicos de referencia (ENRUTA)

Esta carpeta documenta las **fuentes abiertas** que inspiran los indicadores
cargados en la base para análisis de orientación vocacional y el catálogo
(`chile_metrics` en `catalog_items`).

## Fuentes

| Código | Organización | Uso en ENRUTA | Enlace |
|--------|--------------|---------------|--------|
| `SIES_MIFUTURO` | SIES / Mi Futuro (MINEDUC) | Empleabilidad e ingresos por carrera; áreas formativas y matrícula | https://www.mifuturo.cl/buscador-de-estadisticas-por-carrera/ · https://www.mifuturo.cl/sies/ |
| `INE_ENE` | Instituto Nacional de Estadísticas | Estructura de ocupación por actividad económica (referencia) | https://www.ine.gob.cl/estadisticas-por-tema/mercado-laboral/ocupacion-y-desocupacion |
| `MINEDUC_OPEN` | Datos Abiertos MINEDUC | Contexto educativo y catálogos oficiales | https://datosabiertos.mineduc.cl/ |
| `ENRUTA_SYNTH` | ENRUTA | Mapeos RIASEC ↔ sectores y notas pedagógicas (no son series oficiales) | — |

## Empleabilidad e ingresos en el catálogo

Para ítems con serie comparable de educación superior, los valores de
**empleabilidad (4.º año de egreso)** e **ingreso bruto promedio de referencia
(3.er año)** se basan en estadísticas **Mi Futuro / SIES**, tal como se
reportaron públicamente en medios (p. ej. BioBioChile, 6 ene 2025, citando
MiFuturo para el proceso de admisión 2025):

- Artículo de referencia:  
  https://www.biobiochile.cl/noticias/servicios/toma-nota/2025/01/06/todas-las-carreras-con-mas-y-menos-empleabilidad-en-chile-y-cual-es-su-sueldo-promedio.shtml
- Buscador oficial (fuente primaria a contrastar siempre):  
  https://www.mifuturo.cl/buscador-de-estadisticas-por-carrera/
- Metodología SIES (actualizaciones del portal):  
  https://mifuturo.cl/ (sección metodología / estadísticas por carrera)

Cada ítem del catálogo guarda en `chile_metrics`:

- `sourceCode`, `sourceName`, `sourceUrl`, `referenceYear`
- `sourceProgramLabel` si el nombre en Mi Futuro difiere del título ENRUTA
- `secondaryCitation` / `secondaryUrl` cuando se usó un reportaje que cita MiFuturo
- `note` con limitaciones (agregado nacional, variación por institución, etc.)

Los **oficios y rutas** sin programa universitario comparable **no inventan** un
% de empleabilidad: se anclan a INE-ENE (sector) y/o notas pedagógicas, y la UI
lo deja explícito.

## Importante

Los valores en el seed son **agregados de referencia** para orientación
vocacional en el MVP. **No sustituyen** la consulta de las series oficiales
actualizadas de Mi Futuro, INE o MINEDUC, ni predicen el resultado individual
de un estudiante.

La UI muestra siempre fuente, año y enlace, más un disclaimer ético.
