import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { homeForRole, type Role } from "@/lib/rbac";

const { auth } = NextAuth(authConfig);

const rolePrefixes: { prefix: string; roles: Role[] }[] = [
  { prefix: "/app", roles: ["student"] },
  {
    prefix: "/pro",
    roles: ["counselor", "psychologist", "enruta_admin"],
  },
  {
    prefix: "/colegio",
    roles: ["school_admin", "head_teacher", "enruta_admin"],
  },
  { prefix: "/admin", roles: ["enruta_admin"] },
  { prefix: "/familia", roles: ["guardian", "enruta_admin"] },
  { prefix: "/partner", roles: ["partner", "enruta_admin"] },
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/registro") ||
    pathname.startsWith("/recuperar");

  const session = req.auth;
  const role = session?.user?.role as Role | undefined;

  if (isAuthPage && session?.user) {
    return NextResponse.redirect(new URL(homeForRole(role!), req.url));
  }

  for (const rule of rolePrefixes) {
    if (pathname.startsWith(rule.prefix)) {
      if (!session?.user) {
        const url = new URL("/login", req.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
      if (!rule.roles.includes(role!)) {
        return NextResponse.redirect(new URL(homeForRole(role!), req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/app/:path*",
    "/pro/:path*",
    "/colegio/:path*",
    "/admin/:path*",
    "/familia/:path*",
    "/partner/:path*",
    "/login",
    "/registro",
    "/recuperar",
  ],
};
