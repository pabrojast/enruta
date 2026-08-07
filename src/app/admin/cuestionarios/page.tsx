import Link from "next/link";
import { listAssessmentTree } from "@/app/actions/questionnaire-admin";
import { CreateAssessmentForm } from "./create-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminQuestionnairesPage() {
  const tree = await listAssessmentTree();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Constructor de cuestionarios</h1>
        <p className="text-white/60">
          Crea instrumentos, secciones y preguntas con puntajes por dimensión
          RIASEC.
        </p>
      </div>
      <CreateAssessmentForm />
      <div className="grid gap-3">
        {tree.map(({ assessment, versions }) => (
          <Card key={assessment.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{assessment.title}</CardTitle>
                <p className="text-sm text-white/50">{assessment.code}</p>
              </div>
              <Badge>{assessment.isActive ? "activo" : "inactivo"}</Badge>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {versions.map((v) => (
                <div key={v.id} className="flex flex-wrap gap-2">
                  <Link href={`/admin/cuestionarios/${v.id}`}>
                    <Button size="sm" variant="secondary">
                      Editar v{v.version}
                    </Button>
                  </Link>
                  <Link href={`/admin/cuestionarios/${v.id}/preview`}>
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
