import { eq } from "drizzle-orm";
import { db } from "@/db";
import { partnerProfiles } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { PartnerProfileForm } from "./profile-form";

export default async function PartnerHome() {
  const session = await requireRole(["partner", "enruta_admin"]);
  const [profile] =
    session.user.role === "partner"
      ? await db
          .select()
          .from(partnerProfiles)
          .where(eq(partnerProfiles.userId, session.user.id))
          .limit(1)
      : [null];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Perfil de organización</h1>
        <p className="text-white/60">
          Publica charlas, visitas y experiencias para estudiantes ENRUTA.
        </p>
      </div>
      <PartnerProfileForm profile={profile ?? null} />
    </div>
  );
}
