import { Page } from '@playwright/test'
import { step } from '../helpers/test-step-decorator' 


export class FormLayoutsPage {
    private readonly page: Page
    constructor(page: Page) {
        this.page = page
    }
    @step
    async submitUsingTheGridForm(email: string, password: string, optionText: string){
        const usingTheGridEmailForm = this.page.locator('nb-card', { hasText: "Using the grid" })
        await usingTheGridEmailForm.getByRole('textbox', {name: 'Email'}).fill(email)
        await usingTheGridEmailForm.getByRole('textbox', {name: 'Password'}).fill(password)
        await usingTheGridEmailForm.getByLabel('Option 1').check(({force: true}))
        await usingTheGridEmailForm.getByRole('button', {name: 'Sign In'}).click()
    }
    /**
     * 
     * @param fullName - Valid test user full name(First and Last name)
     * @param email - Valid text user email 
     * @param rememberMeCheckbox - Pass `true` to select Remember me checkbox
     */
    @step
    async submitInLineForm(fullName: string, email: string, rememberMeCheckbox: boolean){
        const inLineForm = this.page.locator('nb-card', {hasText: "Inline form"})
        await inLineForm.getByRole('textbox', {name: "Jane Doe"}).fill(fullName)
        await inLineForm.getByRole('textbox', {name: "Email"}).fill(email)
/*         if(rememberMeCheckbox){
            await inLineForm.getByRole('checkbox').check({force: true})
        } */
        if (rememberMeCheckbox == true) {
            await inLineForm.getByRole('checkbox', { name: "Remember me" }).check({ force: true })
        } else if (rememberMeCheckbox == false) {
            await inLineForm.getByRole('checkbox', { name: "Remember me" }).uncheck({ force: true })         
        }
        await inLineForm.getByRole('button', {name: "Submit"}).click()
    }
}