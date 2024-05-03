import { test, expect, Page } from '@playwright/test';

test.describe("Authentication", () => {
    test("Authentication should pass", async ({ page }) => {
        await page.goto("https://leroymerlin-frlm-uat1.nprd-02-a9ef.priv.manawa.adeo.cloud/");
        await acceptCookies(page)
        await page.getByText("Me Connecter").click()
        await acceptCookies(page)
        await expect(page).toHaveTitle(/Se connecter/)

        await page.getByTestId("email--998").fill("email@gmail.com")
        await page.getByTestId("email--998").blur()
        await page.getByText("Continuer", { exact: true }).first().click()
        await acceptCookies(page)
        await expect(page).toHaveTitle(/Créer mon compte/)

        //To BE CONTINUED
    })

    test("Authentication should not pass", async ({ page }) => {
        await page.goto("https://leroymerlin-frlm-uat1.nprd-02-a9ef.priv.manawa.adeo.cloud/");
         //To BE CONTINUED
    })
})


const acceptCookies = async (page: Page) => {
    const btn = page.getByText("Tout accepter")

    if ((await btn.count()) > 0) {
        await btn.first().click()
    }

}