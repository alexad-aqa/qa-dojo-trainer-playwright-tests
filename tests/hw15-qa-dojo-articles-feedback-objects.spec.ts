import { test, expect } from '@playwright/test';
import { testData } from './hw15-qa-dojo-articles-feedback-objects-test-data'
import { goToFeedbackPage, setName, setEmail, selectSubject, selectPriority, setMessage, uploadFile, sendCopy, submit, waitFormVisible } from './hw15-qa-dojo-articles-feedback-objects-page-actions';

test.describe('Feedback Submit', { tag: '@hw15:objects' }, () => {

    for (const data of testData) {

        test(`contact form #${data.id}: ${data.description}`, async ({ page }) => {

            await goToFeedbackPage(page);
            await setName(page, data.formInfo.name);
            await setEmail(page, data.formInfo.email);
            await selectSubject(page, data.formInfo.subject);
            await selectPriority(page, data.formInfo.priority);
            await setMessage(page, data.formInfo.message);

            if (data.formInfo.attachment) {
                await uploadFile(page, data.formInfo.attachment);
            }
            await sendCopy(page, data.formInfo.sendCopyState);
            await submit(page);
            await waitFormVisible(page)
            await data.verify(page, data.formInfo.email);

            console.log(`contact form #${data.id}`, data.formInfo.name, data.formInfo.email, data.formInfo.subject, data.formInfo.priority, data.formInfo.message, data.formInfo.attachment, data.formInfo.sendCopyState)
        })
    }
})