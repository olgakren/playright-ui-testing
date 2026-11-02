import { test, expect } from '@playwright/test'
import { tags } from '../test-data/tags.json'
import { json } from 'node:stream/consumers'
import { request } from 'node:http'


test('Smoke test application loads', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com')

    //Expected title to contain a substirng 
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')
    await expect(page.locator('.sidebar .tag-pill')).toContainText(['Bondar Academy'])
})