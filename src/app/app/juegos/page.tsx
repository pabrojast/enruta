import { DayInLifeGame } from "./day-in-life-game";
import {
  ChallengeGame,
  DecisionGame,
  EnvironmentExplorer,
} from "./more-games";
import { AlertBanner } from "@/components/alert-banner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JuegosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Juegos y simuladores</h1>
        <p className="text-white/60">
          Experiencias breves e inclusivas. No son diagnósticos ni competencias.
        </p>
      </div>
      <AlertBanner tone="info">
        Los resultados sirven para reflexionar y conversar con tu orientador/a.
      </AlertBanner>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Un día en la vida de…</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/65">
            Simula un rol y toma decisiones cotidianas.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Decisiones · Desafíos · Ambientes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/65">
            Tres mini-juegos adicionales para ampliar tu mapa.
          </CardContent>
        </Card>
      </div>

      <DayInLifeGame />
      <DecisionGame />
      <ChallengeGame />
      <EnvironmentExplorer />
    </div>
  );
}
