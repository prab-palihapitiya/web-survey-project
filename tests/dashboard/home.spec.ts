import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
    test("should display the list of questionnaires", async ({ page }) => {
        await page.goto("http://localhost:3000/dashboard");
        await page.waitForSelector("text=Welcome to the dashboard");
        // await page.click("text=Select a Questionnaire");
        // await page.click("text=Questionnaire 1");
        await page.waitForSelector("text=Recent questionnaires");
        // await page.click("text=Select a question");
        // await page.click("text=Question 1");
    });
});