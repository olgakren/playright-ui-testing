import { expect, test } from "@playwright/test";

test('checkboxes', async ({ page }, testInfo) => {
    await page.goto('/');
    
    if (testInfo.project.name == 'mobile-test') {
        await page.locator('.sidebar-toggle').click()
    }
    await page.getByTitle('Modal & Overlays').click()
    await page.getByTitle('Toastr').click()
    if (testInfo.project.name == 'mobile-test') {
        await page.locator('.sidebar-toggle').click()
    }
    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true })
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check({ force: true })
        await expect(box).toBeChecked()
    }
})