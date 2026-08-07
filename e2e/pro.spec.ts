import { test, expect } from "@playwright/test";
import { gotoReady, loginAs } from "./helpers";

test.describe("profesional demo", () => {
  test("login orientadora entra a /pro", async ({ page }) => {
    await loginAs(page, "orientador@losandes.cl");
    await page.waitForURL(/\/pro/, { timeout: 30_000 });
    await expect(page.getByText(/Panel profesional/i).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test("caseload de estudiantes con filtros", async ({ page }) => {
    await loginAs(page, "orientador@losandes.cl");
    await page.waitForURL(/\/pro/, { timeout: 30_000 });
    await gotoReady(page, "/pro/estudiantes");
    await expect(
      page.getByText(/Caseload de estudiantes/i).first(),
    ).toBeVisible({ timeout: 20_000 });
    await expect(
      page.getByText(/en carga|por revisar|requieren atención/i).first(),
    ).toBeVisible();
  });

  test("cola de informes accesible", async ({ page }) => {
    await loginAs(page, "orientador@losandes.cl");
    await page.waitForURL(/\/pro/, { timeout: 30_000 });
    await gotoReady(page, "/pro/informes");
    await expect(page.getByText(/Cola de informes/i).first()).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.getByText(/Por revisar ahora|Con informe|Entregados/i).first(),
    ).toBeVisible();
  });
});
