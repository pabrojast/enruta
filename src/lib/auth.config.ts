import type { NextAuthConfig } from "next-auth";
import type { Role } from "./rbac";

/**
 * Config compatible con Edge (middleware).
 * Providers con bcrypt/DB viven en auth.ts (Node runtime).
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      // Dejamos la lógica de rutas al middleware custom
      void auth;
      void request;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as { role: Role }).role;
        token.schoolId =
          (user as { schoolId?: string | null }).schoolId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.schoolId = (token.schoolId as string | null) ?? null;
      }
      return session;
    },
  },
  trustHost: true,
};
