import { test, expect } from '@playwright/test'
import { tags } from '../test-data/tags.json'
import { json } from 'node:stream/consumers'
import { request } from 'node:http'


test('has title', async ({ page }) => {
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            json: { tags }
        })
    })
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch()
        const responseJSON = await response.json()
        responseJSON.articles[0].title = 'This is mock title for the article'
        responseJSON.articles[0].description = 'This is mock title for the article'
        responseJSON.articles[0].tagList = [
            "tomato",
            "potato",
            "morkvato",
            "burato"
        ]

        await route.fulfill({
            json: responseJSON
        })
    })

    await page.goto('https://conduit.bondaracademy.com')

    //Expected title to contain a substirng 
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')
    await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright'])
    await expect(page.locator('.preview-link h1').first()).toContainText('This is mock title for the article')
    await expect(page.locator('.preview-link p').first()).toContainText('This is mock title for the article')
    await expect(page.locator('.tag-list').first().locator('.tag-pill'))
        .toHaveText(["tomato", "potato", "morkvato", "burato"])
})

test('Delete article', async ({ page, request }) => {
       const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
            data:
            {
                "user": {
                    "email": "randomolga@test.com",
                    "password": "A123456a!"
                }
            }
        })
        expect(loginResponse.status()).toEqual(200)
        const responseLoginJSON = await loginResponse.json()
        const token = responseLoginJSON.user.token

    const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {
                "title": "Test title ",
                "description": "test description ",
                "body": "test article body ",
                "tagList": [
                    "testTag1"
                ]
            }
        },
        headers: {
            Authorization: `Token ${token}`
        }
    })
    expect(newArticleResponse.status()).toEqual(201)
    const responseNewArticleJSON = await newArticleResponse.json()
    expect(responseNewArticleJSON.article.title).toContain('Test title')
    const slugID = responseNewArticleJSON.article.slug

    await page.goto('https://conduit.bondaracademy.com')

    
    await expect(page.locator('.preview-link h1').first()).toContainText('Test title')

    const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
        headers: {
            Authorization: `Token ${token}`
        }
    })
    expect(deleteResponse.status()).toEqual(204)


    /*  await page.getByText('Test title').click()
        await page.getByRole('button', {name: 'Delete Article'}).first().click()
        await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
        await expect(page.locator('.preview-link h1').first()).not.toContainText('Test title')
     */
}) 