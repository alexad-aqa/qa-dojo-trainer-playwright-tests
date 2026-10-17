import { test, expect } from '@playwright/test'
import { registerUser } from './hw12-qa-dojo-articles-functions-page-actions'
import { goToArticlesHomePage, goToGlobalFeed, goToArticleLongRead, followUser, createMultipleArticles, findArticlesAcrossGlobalPages, findArticlesAcrossFeedPages, waitForFirstArticleVisible } from './hw14-qa-dojo-articles-functions-arrays-editor-page-actions'


test.describe('Articles Create', { tag: '@hw14:functions/arrays' }, () => {

    test('Multiple Articles Created and visible on Global/Feed Lists', async ({ page }) => {

        const myArticleTitles = await test.step('Create Articles as newly registered User#1', async () => {
            const user = await registerUser(page, 'aqa1');
            console.log('User#1', user.email, user.username);
            return await createMultipleArticles(page, 11);
        });

        await test.step('Articles present on Global Page(s) for User#1', async () => {
            await goToArticlesHomePage(page);
            await goToGlobalFeed(page);
            await waitForFirstArticleVisible(page)

            const foundArticleTitlesOnGlobal = await findArticlesAcrossGlobalPages(page, myArticleTitles)

            expect.soft(foundArticleTitlesOnGlobal.length).toBe(myArticleTitles.length);

            for (const title of myArticleTitles) {
                expect.soft(foundArticleTitlesOnGlobal, `${title} not found on Global Page`).toContain(title);
            }
        });

        await test.step('Register as User#2 & Follow User#1', async () => {
            const user = await registerUser(page, 'aqa2');
            console.log('User#2', user.email, user.username);
            await goToGlobalFeed(page);
            await goToArticleLongRead(page, myArticleTitles[0])
            await followUser(page);
        });

        await test.step('Articles present on Feed Page for User#2', async () => {
            await goToArticlesHomePage(page);
            await waitForFirstArticleVisible(page)

            const foundArticleTitlesOnFeed = await findArticlesAcrossFeedPages(page, myArticleTitles)

            expect.soft(foundArticleTitlesOnFeed.length).toBe(myArticleTitles.length);

            for (const title of myArticleTitles) {
                expect.soft(foundArticleTitlesOnFeed, `${title} not found on Feed Page`).toContain(title);
            }
        });
    });
});