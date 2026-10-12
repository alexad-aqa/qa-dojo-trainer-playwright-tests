import { test, expect } from '@playwright/test'
import { submitRegistrationForm, registerNewUser } from './qa-dojo-articles-functions-page-actions-hw12'
import { goToEditorPage, createArticle, goToArticlesHomePage, goToGlobalFeed, searchArticleByName, followUser, readFirstArticle, createMultipleArticles } from './qa-dojo-articles-functions-arrays-editor-page-actions-hw14'


test.describe('Articles Create', { tag: '@hw14:functions/arrays' }, () => {

    test('10 Articles Created and visible on Global/Feed Lists', async ({ page }) => {

        await registerNewUser(page, 'aqa1');
        const titles = await createMultipleArticles(page);
        await goToArticlesHomePage(page);
        await goToGlobalFeed(page);

        const previewArticleTitle = page.getByTestId(/preview-title/);
        await previewArticleTitle.first().waitFor({ state: 'visible', timeout: 5000 });

        const foundTitles = [];
        const pagination = page.getByTestId(/pagination-page/);
        const paginationCount = await pagination.count();


        for (let i = 0; i < paginationCount; i++) {

            const currentPage = pagination.nth(i);
            const pageNumber = await pagination.nth(i).textContent();
            console.log(`Go to page #: ${pageNumber}`);


            await currentPage.click();
            await previewArticleTitle.first().waitFor({ state: 'visible', timeout: 5000 });

            const previewTitles = await previewArticleTitle.allTextContents();

            for (const myTitle of previewTitles) {
                if (titles.includes(myTitle)) {
                    console.log(`Found on page: ${pageNumber}: ${myTitle}`);

                    if (!foundTitles.includes(myTitle)) {
                        foundTitles.push(myTitle);
                    }
                }

            }
        }

        expect(foundTitles.length).toBe(titles.length);

        for (const t of titles) {
            expect(foundTitles).toContain(t);
        }

        await registerNewUser(page, 'aqa2');
        await goToGlobalFeed(page);
        await searchArticleByName(page, titles[0]);
        await readFirstArticle(page);
        await followUser(page);
        await goToArticlesHomePage(page);

        await previewArticleTitle.first().waitFor({ state: 'visible', timeout: 5000 });
        const previewTitles = await previewArticleTitle.allTextContents()
        for (const t of titles) {
            expect(previewTitles).toContain(t);
            console.log(`Articles found on Your Feed Page: ${t}`)
        }
    });
});