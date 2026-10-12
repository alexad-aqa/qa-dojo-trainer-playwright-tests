import { test, expect } from '@playwright/test'
import { submitRegistrationForm } from './qa-dojo-articles-functions-page-actions-hw12'
import { goToEditorPage, createArticle, goToArticlesHomePage, goToGlobalFeed, searchArticleByName, followUser, readFirstArticle } from './qa-dojo-articles-functions-arrays-editor-page-actions-hw14'


test.describe('Articles Create', { tag: '@hw14:functions/arrays' }, () => {
    let username: string;
    let email: string;
    let password: string;


    test('10 Articles Created and visible on Global/Feed Lists', async ({ page }) => {

        const userProfile_Header = page.getByTestId('nav-profile');

        username = `aqa1_${Date.now()}`;
        email = `aqa1_${Date.now()}@mail.com`;
        password = `qwerty123`;

        await page.goto('/articles/register');
        await submitRegistrationForm(page, username, email, password);
        await expect(userProfile_Header).toContainText(username);

        const titles = [];
        const randomNumber = Math.floor(Math.random() * 1000000);

        for (let i = 1; i <= 10; i++) {
            const title = `aqa1_${randomNumber}-${i}`;
            const description = `aqa1-${i}`;
            const body = `aqa1-${i}`;
            const tag = ['automation, functions, arrays'].toString()

            await goToEditorPage(page);
            await createArticle(page, title, description, body, tag);
            titles.push(title);
        }

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

        username = `aqa2_${Date.now()}`;
        email = `aqa2_${Date.now()}@mail.com`;
        password = `qwerty123`;

        await page.goto('/articles/register');
        await submitRegistrationForm(page, username, email, password);

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