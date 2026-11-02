import { test } from '../fixture'
import { faker } from '@faker-js/faker'

test('Navigate to form layout page', {tag: '@smoke'}, async({pom}) => {
    await pom.navigateTo.formLayoutsPage()
    await pom.navigateTo.datepickerPage()
    await pom.navigateTo.smartTablePage()
    await pom.navigateTo.toasterPage()
    await pom.navigateTo.tooltipPage()
})
test('Parametrized page object method', async ({pom}) => {
    const randomFullName = faker.person.fullName()
    const randomEmail = faker.internet.email({provider: 'test.com'})
    await pom.navigateTo.formLayoutsPage()
    await pom.formLayoutsPage.submitUsingTheGridForm(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!, 'Option 1')
    await pom.formLayoutsPage.submitInLineForm(randomFullName, randomEmail, true)

    /* await pom.navigateTo.datepickerPage()
    await pom.datepickerPage.selectCommonDatePickerDateFromToday(5)
    await pom.datepickerPage.selectDatePickerRangeFromToday(7, 20) */
})

