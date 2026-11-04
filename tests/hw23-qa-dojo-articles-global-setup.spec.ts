import { test, expect } from '@playwright/test';
import {
  createMultipleArticles,
  goToArticlesHomePage,
  goToGlobalFeed,
  openArticlesPage,
  findArticlesAcrossGlobalPages,
} from './hw14-qa-dojo-articles-functions-arrays-editor-page-actions';

test.describe('Articles Create', { tag: '@hw23:global-setup' }, () => {
  // test.use({ storageState: { cookies: [], origins: [] } });

  test.use({ storageState: 'playwright/.auth/user.json' });

  test('Multiple Articles Created and visible on Global/Feed Lists', async ({
    page,
  }) => {
    await openArticlesPage(page);
    const myArticleTitles = await createMultipleArticles(page, 3);
    console.log(myArticleTitles);
    await goToArticlesHomePage(page);
    await goToGlobalFeed(page);

    const latestTitle = myArticleTitles[myArticleTitles.length - 1];
    await expect(page.locator(`text=${latestTitle}`)).toBeVisible({
      timeout: 7000,
    });

    const foundArticleTitlesOnGlobal = await findArticlesAcrossGlobalPages(
      page,
      myArticleTitles,
    );

    expect.soft(foundArticleTitlesOnGlobal.length).toBe(myArticleTitles.length);

    for (const title of myArticleTitles) {
      expect
        .soft(foundArticleTitlesOnGlobal, `${title} not found on Global Page`)
        .toContain(title);
    }
  });
});
