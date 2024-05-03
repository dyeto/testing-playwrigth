import { test, expect } from '@playwright/test';

test('Test avec interaction manuelle', async ({ page }) => {
    await page.goto('https://playwright.dev/');


    // Mettre en pause l'exécution pour permettre une interaction manuelle
    //await page.pause();

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click();
});
