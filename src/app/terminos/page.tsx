import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata = {
  title: "Términos de uso · ENRUTA",
  description:
    "Condiciones de uso de la plataforma ENRUTA de orientación vocacional.",
};

export default function TerminosPage() {
  return (
    <div className="grid-noise min-h-screen min-h-dvh">
      <PublicHeader />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-pink">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Términos de uso</h1>
          <p className="mt-2 text-sm text-white/50">
            Versión orientativa del producto · Actualizada 2026
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-white/70">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">1. Aceptación</h2>
            <p>
              Al registrarte o usar ENRUTA aceptas estos términos y la{" "}
              <Link href="/privacidad" className="text-neon-cyan hover:underline">
                política de privacidad
              </Link>
              . Si no estás de acuerdo, no uses la plataforma.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              2. Qué es (y qué no es) ENRUTA
            </h2>
            <p>
              ENRUTA es una herramienta de{" "}
              <strong className="text-white/90">orientación vocacional</strong>{" "}
              que combina cuestionarios, exploración de rutas, portafolio y
              mediación profesional.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="text-white/90">No</strong> es un diagnóstico
                psicológico, médico ni psicométrico certificado.
              </li>
              <li>
                <strong className="text-white/90">No</strong> garantiza
                admisión, empleo ni un único “destino” profesional.
              </li>
              <li>
                Los resultados son <strong className="text-white/90">orientativos</strong> y
                deben interpretarse con un profesional del establecimiento.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">3. Cuentas y roles</h2>
            <p>
              El acceso de estudiantes y equipos escolares se organiza por
              establecimiento y roles (estudiante, orientación, psicología, UTP,
              familia, partner, administración). Debes usar credenciales propias
              y no compartir contraseñas. El establecimiento define quién puede
              invitar usuarios (códigos de registro, altas admin).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              4. Uso aceptable
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Usar la plataforma solo con fines de orientación educativa.</li>
              <li>
                No intentar acceder a datos de otros establecimientos o roles no
                autorizados.
              </li>
              <li>
                No subir contenido ilegal, ofensivo o que vulnere derechos de
                terceros (p. ej. materiales de partners).
              </li>
              <li>
                No presentar resultados ENRUTA como “prueba científica definitiva”
                ante terceros.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              5. Contenido y datos públicos
            </h2>
            <p>
              Indicadores de empleabilidad, ingresos o mercado laboral se basan
              en fuentes públicas de referencia (p. ej. Mi Futuro / SIES, INE) y
              pueden estar simplificados. Debes contrastar siempre las series
              oficiales actualizadas antes de decisiones institucionales. Ver
              también el explorador y{" "}
              <Link href="/metodologia" className="text-neon-cyan hover:underline">
                metodología
              </Link>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              6. Responsabilidad profesional
            </h2>
            <p>
              La validación y entrega de informes es responsabilidad del equipo
              profesional del establecimiento. ENRUTA potencia ese trabajo; no lo
              reemplaza. El colegio define protocolos de derivación ante
              situaciones de riesgo o bienestar.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              7. Disponibilidad y cambios
            </h2>
            <p>
              El servicio se ofrece “tal cual” en entornos demo o piloto, con
              posible interrupción por mantención. Podemos actualizar funciones y
              estos términos; los cambios relevantes se comunicarán en el sitio o
              al establecimiento.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              8. Limitación de responsabilidad
            </h2>
            <p>
              En la máxima medida permitida por la ley, ENRUTA y sus operadores
              no responden por decisiones de estudio o trabajo tomadas solo con
              base en resultados orientativos de la plataforma, ni por
              interrupciones del servicio en ambientes de demostración.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">9. Contacto</h2>
            <p>
              Dudas sobre estos términos:{" "}
              <Link href="/contacto" className="text-neon-cyan hover:underline">
                contacto
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
