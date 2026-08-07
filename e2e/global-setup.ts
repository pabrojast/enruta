/**
 * Warm the Next.js server so the first E2E specs don't race Turbopack compile.
 */
async function warm(path: string, base: string) {
  const url = `${base.replace(/\/$/, "")}${path}`;
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok || res.status === 307 || res.status === 302) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.warn(`[global-setup] could not warm ${url}`);
}

export default async function globalSetup() {
  const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
  for (const path of ["/", "/login", "/privacidad", "/descubrir", "/app", "/pro", "/colegio"]) {
    await warm(path, base);
  }
}
