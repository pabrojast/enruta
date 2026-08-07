import { test, expect } from "@playwright/test";
import { gotoReady } from "./helpers";

test.describe("sitio público", () => {
  test("home muestra valor y CTAs", async ({ page }) => {
    await gotoReady(page, "/");
    await expect(page.getByText(/Descubre tu norte/i).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page.getByRole("link", { name: /Comencemos tu ruta/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Probar sin cuenta/i }).first(),
    ).toBeVisible();
  });

  test("páginas legales accesibles", async ({ page }) => {
    await gotoReady(page, "/privacidad");
    await expect(page.getByText(/Política de privacidad/i).first()).toBeVisible();
    await gotoReady(page, "/terminos");
    await expect(page.getByText(/Términos de uso/i).first()).toBeVisible();
  });

  test("micro-quiz /descubrir arranca sin cuenta", async ({ page }) => {
    await gotoReady(page, "/descubrir");
    await expect(
      page.getByText(/Descubre un primer norte/i).first(),
    ).toBeVisible();
    await page.getByRole("button", { name: /^Empezar$/i }).click();
    await expect(page.getByText(/Pregunta 1 de/i)).toBeVisible();
  });
});
