import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const cards = [
  { title: "Historia personal", desc: "Tu punto de partida y línea de vida." },
  { title: "Intereses", desc: "Qué te llama la atención hoy." },
  { title: "Habilidades", desc: "Cognitivas, sociales, prácticas y técnicas." },
  { title: "Fortalezas", desc: "Lo que ya te sale natural o has practicado." },
  { title: "Valores", desc: "Qué es importante para ti al trabajar o estudiar." },
  { title: "Motivaciones", desc: "Por qué harías el esfuerzo." },
  { title: "Preferencias de aprendizaje", desc: "Cómo te gusta aprender." },
  { title: "Preferencias de trabajo", desc: "Ambientes y ritmos." },
  { title: "Expectativas", desc: "Tus metas y las de tu entorno." },
  { title: "Experiencias", desc: "Lo que ya viviste y te enseñó algo." },
  { title: "Metas", desc: "Corto, mediano y largo plazo." },
  { title: "Contexto familiar y territorial", desc: "Apoyos y territorio." },
];

export default function AutoconocimientoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Módulo de autoconocimiento</h1>
        <p className="text-white/60">
          Tarjetas para ir conociéndote. En el MVP, el cuestionario de intereses
          es el instrumento principal; el perfil concentra tus reflexiones
          abiertas.
        </p>
      </div>
      <Progress value={35} label="Avance estimado del módulo" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader>
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-white/60">{c.desc}</p>
              <Link href="/app/perfil">
                <Button size="sm" variant="secondary">
                  Registrar en perfil
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <Link href="/app/cuestionarios">
        <Button>Ir al cuestionario de intereses</Button>
      </Link>
    </div>
  );
}
