import { expect, test } from '@playwright/test';


test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('Test Suite 1', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
    });

    test.skip('This is the first test ', async ({ page }) => {
        await page.getByText('Form Layouts').click();
    });
    test.skip('This is the first test to datepicker', async ({ page }) => {
        await page.getByText('Datepicker').click();
    });

})

test("Test user visible locators ", async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).first().click();
    await page.getByRole('textbox', { name: 'Email' }).first().fill('test@example.com');
    await page.getByLabel('Email').nth(1).fill('test@example.com');
    await page.getByPlaceholder('Jane Doe').fill('Olga Kuku');
    await page.getByText('Submit').first().click();
    await page.getByTestId('inputEmail1').first().fill('test@example.com');
    await page.getByTitle('Forms').click();
})
test('Locating child elements', async ({ page }) => {
    await page.locator('nb-card').locator('nb-radio-group').locator(':text-is("Option 1")').click();
    await page.locator('nb-card nb-radio-group :text-is("Option 2")').click();
    await page.locator('nb-card').getByRole('button', {name: 'Sign In'}).first().click();
    await page.locator('nb-card').nth(3).getByRole('button').click();//using nth not recommended

})

test('Locating parent elements', async ({ page }) => {
    await page.locator('nb-card', {hasText: 'Using the grid'}).getByRole('button').click();
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('button').click();
    await page.locator('nb-card').filter({hasText: 'Basic form'}).getByRole('button').click();
    await page.locator('nb-card')
        .filter({has: page.locator('nb-checkbox')})
        .filter({hasText: 'Sign in'})
        .getByLabel('Email')
        .fill('test@example.com')

    await page.getByText('Using the grid').locator('..').getByRole('button').click();

})
test ('Reusing locators', async ({ page }) => {
    const basicFormSection = page.locator('nb-card', {hasText: 'Basic form'});
    const emailInputField = basicFormSection.getByLabel('Email');

    await emailInputField.fill('test@example.com');
    await basicFormSection.getByLabel('Password').fill('testpassword');
    await basicFormSection.locator('nb-checkbox').click();
    await basicFormSection.getByRole('button').click();

    await expect(emailInputField).toHaveValue('test@example.com');
    })

    test('Extracting values', async ({ page }) => {
        // Extracting text from a single element
        const basicFormSection = page.locator('nb-card', {hasText: 'Basic form'});
        const submitButtonText = await basicFormSection.getByRole('button').textContent();
       expect (submitButtonText).toEqual('Submit');

       //Extract multiple text values
         const allRadioButtonsValues = await page.locator('nb-radio').allTextContents();
         expect (allRadioButtonsValues).toContain('Option 1');

        //Extract input text value
        const emailField = basicFormSection.getByRole('textbox', {name: 'Email'});
        await emailField.fill('test@example.com');
        const emailFieldValue = await emailField.inputValue();
        console.log('Email field value:', emailFieldValue);
        //expect(emailFieldValue).toEqual('test@example.com');

        //Extracting attribute value
        const emailPlacehorlder = await emailField.getAttribute('placeholder');
        console.log('Email field placeholder:', emailPlacehorlder);
      
    })

    test('Assertions', async ({ page }) => {
        const basicFormSectionButton = page.locator('nb-card', {hasText: 'Basic form'}).getByRole('button');

        //Generic assertions
        const submitButtonText = await basicFormSectionButton.textContent();
        expect(submitButtonText).toEqual('Submit');

        //Locator assertions
        await expect(basicFormSectionButton).toHaveText('Submit');

        //Negative assertions
        await expect(basicFormSectionButton).not.toHaveText('Sign In');

        //Soft assertions
        await expect.soft(basicFormSectionButton).toHaveText('Submit');
        await basicFormSectionButton.click();
  

      
    })
