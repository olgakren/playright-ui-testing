import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto('/');

})


test.describe.only('Form layouts page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Inputs fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the grid" }).getByRole('textbox', { name: "Email" })
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially("test2@test.com", { delay: 500 })

        //extract the value 
        const inputValue = await usingTheGridEmailInput.inputValue()

        //assertions
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
        //partial assertion
        await expect(usingTheGridEmailInput).toHaveValue(/test2/)
    })
    test('Radio buttons', {tag: '@smoke'}, async ({ page }) => {
        const usingTheGridEmailForm = page.locator('nb-card', { hasText: "Using the grid" })

        //await usingTheGridEmailForm.getByLabel('Option 1').check({force: true})
        await usingTheGridEmailForm.getByRole('radio', { name: 'Option 1' }).check({ force: true });

        await expect(usingTheGridEmailForm.getByRole('radio', { name: "Option 1" })).toBeChecked()
        await expect(usingTheGridEmailForm.getByRole('radio', { name: "Option 2" })).not.toBeChecked()
        await expect(usingTheGridEmailForm.getByRole('radio', { name: 'Disabled Option' })).toBeDisabled()

    })

}
)
test('checkboxes', async ({ page }) => {
    await page.getByTitle('Modal & Overlays').click()
    await page.getByTitle('Toastr').click()

    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true })

    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()) {
        await box.check({ force: true })
        await expect(box).toBeChecked()
    }

})
test('Lists and dropdowns', async ({ page }) => {
    await page.getByTitle('Modal & Overlays').click()
    await page.getByTitle('Toastr').click()

    //standart dropdown
    await page.locator('nb-card-body', { hasText: 'Toast type:' }).getByRole('combobox').selectOption('danger')
    //await page.locator('.form-group', {hasText: 'Toast type:'}).getByRole('combobox').selectOption('danger')
    await expect(page.getByRole('combobox')).toHaveValue('danger')

    //custom dropdown
    await page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select').click()
    //option 1
    //await page.getByRole('list').getByText('top-end').click()
    //option 2
    await page.locator('nb-option', { hasText: 'top-right' }).click()
    await expect(page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select')).toHaveText('top-right')
    //await expect(page.getByRole('button', { name: 'bottom-right' })).toBeVisible();

    //looping through the list
    const positionDropDownField = page.locator('.form-group', { hasText: 'Position:' }).locator('nb-select')
    await positionDropDownField.click()
    const allListValues = await page.locator('nb-option').allTextContents()
    for (const listValue of allListValues) {
        await page.locator('nb-option', { hasText: listValue }).click()
        await expect(positionDropDownField).toHaveText(listValue)
        await positionDropDownField.click()
    }
})

test('tootip', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    await page.getByRole('button', { name: 'Success' }).hover()
    await expect(page.getByRole('tooltip')).toHaveText('This is a tooltip')

    /*  const dangerButton = page
         .getByRole('button', { name: 'Show Tooltip' })
         .nth(1); */

    await expect(page.getByRole('button', { name: 'Show Tooltip' })
        .nth(1)).toHaveAttribute(
            'nbtooltipicon',
            'alert-triangle'
        );

    await expect(page.getByRole('button', { name: 'Show Tooltip' })
        .nth(1)).toHaveAttribute(
            'nbtooltipstatus',
            'danger'
        );

})
//native dialog testing 
test('dialog box', async ({ page }) => {
    await page.getByTitle('Tables & Data').click()
    await page.getByTitle('Smart Table').click()
    //add event listener 
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.locator('tr', { hasText: '@mdo' }).locator('.nb-trash').click()
    await expect(page.locator('tr', { hasText: '@mdo' })).not.toBeVisible()
})

test('web tables', async ({ page }) => {
    await page.getByTitle('Tables & Data').click()
    await page.getByTitle('Smart Table').click()

    //how to select row by any visible text 
    const tableRowByEmail = page.getByRole('row', { name: 'snow@gmail.com' })
    await tableRowByEmail.locator('.nb-edit').click()
    await tableRowByEmail.getByPlaceholder('Age').fill('25')
    await tableRowByEmail.locator('.nb-checkmark').click()
    await expect(tableRowByEmail.locator('td').last()).toHaveText('25')

    //get row by the specific column value
    const tableRowById = page.getByRole('row').filter({ has: page.getByRole('cell').nth(1).getByText('7') })
    await tableRowById.locator('.nb-edit').click()
    await page.locator('tbody').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('tbody').getByPlaceholder('First Name').fill('Warwara')

    await page.locator('tbody').locator('.nb-checkmark').click()
    await expect(tableRowById.locator('td').nth(5)).toHaveText('test@test.com')
    await expect(tableRowById.locator('td').nth(2)).toHaveText('Warwara')

    //loop through table rows
    const ages = ["20", "30", "40", "200"]
    for (let age of ages) {
        await page.getByPlaceholder('Age').fill(age)
        if (age == "200") {
            await expect(page.locator('tbody')).toContainText('No data found')
        } else {
            await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText(age)
            const allTableRows = await page.locator('tbody tr').all()
            for (let row of allTableRows) {
                await expect(row.locator('td').last()).toHaveText(age)
            }
        }
    }

})

test('datepicker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    /*     await page.locator('.day-cell:not(.bounding-month)').getByText('30').click()
        await expect(calendarInputField).toHaveValue(/30/)
    
        await calendarInputField.click()
        await page.locator('.day-cell:not(.bounding-month)').getByText('2', { exact: true }).click()
        await expect(calendarInputField).toHaveValue('Oct 2, 2026') */

    const date = new Date();
    date.setDate(date.getDate() + 35);
    const expectedDay = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
    const expectedYear = date.getFullYear()
    const expectedDate = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`

    let currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    while (!currentMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.locator('.next-month').click()
        currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
    await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(expectedDate)

})
test('sliders', async ({ page }) => {
    //setting the atribute values
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate(element => {
        element.setAttribute('cx', '268.956')
        element.setAttribute('cy', '139.295')
    })
    await tempGauge.click()

    //mouse movement 
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    const box = await tempBox.boundingBox()
    if (!box) {
        throw new Error('Temperature box is not available')
    }
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')

})
test('iFrames', async ({ page }) => {
    await page.getByTitle('Modal & Overlays').click()
    await page.getByTitle('Dialog').click()
    const frameocator = page.frameLocator('[data-cy="esc-close-iframe"]')
    await frameocator.getByRole('button', { name: 'Open Dialog with esc close' }).click()
    await expect(page.locator('nb-dialog-container nb-card-header'))
        .toHaveText('This is a title passed to the dialog component')
    await page.getByRole('button', { name: 'Dismiss Dialog' }).click();
})
test('Drag & Drop', async ({ page }) => {
    await page.getByTitle('Extra Components').click()
    await page.getByTitle('Drag & Drop').click()
    //1
    await page.getByText('Get groceries').dragTo(page.locator('#drop-list'))
    //2 move by mouse
    await page.getByText('Feed the dog').hover()
    await page.mouse.down()
    await page.locator('#drop-list').hover()
    await page.mouse.up()
})

