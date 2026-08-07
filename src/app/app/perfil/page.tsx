import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getStudentByUserId, hasRequiredConsents } from "@/lib/students";
import { ProfileForm } from "./profile-form";
import { PageHeader } from "@/components/page-header";

export default async function ProfilePage() {
  const session = await requireRole(["student"]);
  const row = await getStudentByUserId(session.user.id);
  if (!row) redirect("/login");
  if (!(await hasRequiredConsents(row.student.id))) {
    redirect("/app/consentimiento");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        eyebrow="Autoconocimiento"
        title="Tu perfil"
        description="Esta información alimenta tu portafolio y contextualiza tu proceso. Puedes actualizarla cuando cambien tus intereses."
      />
      <ProfileForm student={row.student} fullName={row.user.fullName} />
    </div>
  );
}
