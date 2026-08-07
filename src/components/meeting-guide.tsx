import type { MeetingBlock } from "@/lib/meeting-template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function MeetingGuide({
  title,
  durationLabel,
  blocks,
  closing,
}: {
  title: string;
  durationLabel: string;
  blocks: MeetingBlock[];
  closing: string[];
}) {
  return (
    <Card className="border-neon-pink/25 bg-gradient-to-br from-neon-pink/8 to-transparent">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {durationLabel}
          </span>
        </div>
        <p className="text-sm text-white/55">
          Guion orientativo para la sesión. Adapta al criterio profesional y al
          protocolo del establecimiento.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-3">
          {blocks.map((b, i) => (
            <li
              key={b.title}
              className="rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <p className="text-sm font-medium text-white">
                <span className="tabular text-neon-cyan">{i + 1}.</span> {b.title}{" "}
                <span className="font-normal text-white/40">
                  · ~{b.minutes} min
                </span>
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/65">
                {b.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        {closing.length > 0 ? (
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
              Cierre y resguardo
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/65">
              {closing.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
