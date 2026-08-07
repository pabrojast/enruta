import { test, expect } from "@playwright/test";
import { gotoReady, loginAs } from "./helpers";

test.describe("estudiante demo", () => {
  test("login redirige al espacio /app", async ({ page }) => {
    await loginAs(page, "sofia.estudiante@demo.cl");
    await page.waitForURL(/\/app/, { timeout: 30_000 });
    await expect(page).toHaveURL(/\/app/);
  });

  test("dashboard o consentimiento visible tras login", async ({ page }) => {
    await loginAs(page, "sofia.estudiante@demo.cl");
    await page.waitForURL(/\/app/, { timeout: 30_000 });

    const marker = page
      .getByText(/Consentimiento y uso de datos|Hola|Tu ruta|Siguiente paso|Avance de tu ruta/i)
      .first();
    await expect(marker).toBeVisible({ timeout: 20_000 });
  });

  test("explorar está accesible para el estudiante", async ({ page }) => {
    await loginAs(page, "sofia.estudiante@demo.cl");
    await page.waitForURL(/\/app/, { timeout: 30_000 });

    const terms = page.locator('input[name="terms"]');
    if (await terms.isVisible().catch(() => false)) {
      await terms.check();
      await page.locator('input[name="data"]').check();
      await page.getByRole("button", { name: /Aceptar y continuar/i }).click();
      await page.waitForURL(/\/app/, { timeout: 20_000 });
    }

    await gotoReady(page, "/app/explorar");
    await expect(
      page.getByText(/Explorar posibilidades/i).first(),
    ).toBeVisible({ timeout: 20_000 });
  });
});
