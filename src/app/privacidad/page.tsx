import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export const metadata = {
  title: "Privacidad · ENRUTA",
  description:
    "Cómo ENRUTA trata datos de orientación educativa de estudiantes en Chile.",
};

export default function PrivacidadPage() {
  return (
    <div className="grid-noise min-h-screen min-h-dvh">
      <PublicHeader />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Política de privacidad
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Versión orientativa del producto · Actualizada 2026 · No sustituye
            asesoría legal del establecimiento
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-white/70">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">1. Quiénes somos</h2>
            <p>
              ENRUTA es una plataforma de orientación vocacional para
              establecimientos de educación media en Chile. El responsable del
              tratamiento en el uso escolar es, en la práctica, el{" "}
              <strong className="text-white/90">establecimiento</strong> que
              contrata o activa la cuenta, en coordinación con el equipo ENRUTA
              como encargado técnico del servicio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              2. Qué datos tratamos
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Identificación y contacto: nombre, correo, rol, establecimiento y
                curso.
              </li>
              <li>
                Datos de orientación: perfil, respuestas de cuestionarios,
                resultados dimensionales, informes, portafolio, proyecto de
                vida, eventos y seguimientos.
              </li>
              <li>
                Datos de uso técnicos: sesión, notificaciones in-app, registros
                de correo en outbox, logs de integraciones.
              </li>
              <li>
                Datos de familia (si aplica): vínculo apoderado–estudiante y
                expectativas, con permisos limitados.
              </li>
            </ul>
            <p>
              <strong className="text-white/90">No</strong> emitimos
              diagnósticos clínicos ni tratamos historial médico. Las alertas
              “restringidas” solo son visibles a roles autorizados (p. ej.
              psicología / administración).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              3. Para qué los usamos
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Acompañar el proceso de orientación 1°–4° medio.</li>
              <li>
                Generar borradores de informe para mediación profesional y
                exploración de rutas.
              </li>
              <li>
                Entregar indicadores agregados al establecimiento (sin
                exponer respuestas sensibles a roles no autorizados).
              </li>
              <li>Operar la plataforma (seguridad, soporte, notificaciones).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              4. Base y consentimiento
            </h2>
            <p>
              El uso por estudiantes se activa con registro institucional
              (código de establecimiento) y aceptación de consentimientos en la
              app. El establecimiento debe alinear este tratamiento con su marco
              interno y la normativa chilena de protección de datos personales
              aplicable (incl. principios de finalidad, proporcionalidad y
              seguridad).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              5. Quién puede ver qué
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="text-white/90">Estudiante:</strong> su
                perfil, cuestionarios, informe entregado, exploración y
                portafolio.
              </li>
              <li>
                <strong className="text-white/90">Orientación / psicología:</strong>{" "}
                carga asignada, borradores e informes, alertas según rol.
              </li>
              <li>
                <strong className="text-white/90">UTP / profesor jefe:</strong>{" "}
                indicadores agregados y participación; no respuestas sensibles
                por defecto.
              </li>
              <li>
                <strong className="text-white/90">Familia:</strong> información
                acotada de acompañamiento; no ve por defecto respuestas
                sensibles del cuestionario.
              </li>
              <li>
                Los datos se separan por <strong className="text-white/90">establecimiento</strong>.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              6. Encargados y transferencias
            </h2>
            <p>
              El hosting y herramientas técnicas (base de datos, correo SMTP si
              está configurado) pueden implicar encargados de tratamiento. En el
              despliegue demo local los datos permanecen en la infraestructura
              configurada por quien opera el servicio. No vendemos datos
              personales.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              7. Conservación y seguridad
            </h2>
            <p>
              Los datos se conservan mientras el establecimiento mantenga la
              cuenta activa y según sus políticas de archivo escolar. Aplicamos
              controles de acceso por rol, autenticación y separación por
              colegio. Ningún sistema es 100% invulnerable: reporta incidentes al
              equipo del establecimiento y a contacto ENRUTA.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">8. Tus derechos</h2>
            <p>
              Puedes solicitar acceso, rectificación, actualización o
              limitación del uso de tus datos a través de tu establecimiento y,
              cuando corresponda, del canal de contacto ENRUTA. Si eres menor de
              edad, tu apoderado/a puede ejercer derechos conforme a la normativa
              y al protocolo del colegio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">9. Contacto</h2>
            <p>
              Consultas sobre privacidad del producto:{" "}
              <Link href="/contacto" className="text-neon-cyan hover:underline">
                formulario de contacto
              </Link>
              . Para ejercicios de derechos sobre tu ficha escolar, inicia
              siempre por orientación o dirección de tu establecimiento.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-white">10. Relacionado</h2>
            <p>
              <Link href="/terminos" className="text-neon-cyan hover:underline">
                Términos de uso
              </Link>
              {" · "}
              <Link href="/metodologia" className="text-neon-cyan hover:underline">
                Metodología
              </Link>
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
