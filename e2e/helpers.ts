import { type Page, expect } from "@playwright/test";

export const DEMO_PASSWORD =
  process.env.DEMO_PASSWORD ?? "EnrutaDemo2026!";

export async function gotoReady(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  // Turbopack may still be compiling; wait for body content
  await page.locator("body").waitFor({ state: "visible" });
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {
    /* ok if long-polls keep network busy */
  });
}

export async function loginAs(
  page: Page,
  email: string,
  password = DEMO_PASSWORD,
) {
  await gotoReady(page, "/login");
  // Prefer form field — more stable than heading role while compiling
  const emailField = page.locator("#email");
  await expect(emailField).toBeVisible({ timeout: 30_000 });
  await emailField.fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: /^Ingresar$/i }).click();
}
