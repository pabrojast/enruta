import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.describe("colegio demo", () => {
  test("UTP ve indicadores y avance por curso", async ({ page }) => {
    await loginAs(page, "utp@losandes.cl");
    await page.waitForURL(/\/colegio/, { timeout: 30_000 });
    await expect(
      page.getByText(/Indicadores del establecimiento/i).first(),
    ).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/Avance por curso/i).first()).toBeVisible();
  });
});
