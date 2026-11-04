import { test } from '@playwright/test';
import {
  createMultipleArticles,
  goToArticlesHomePage,
  goToGlobalFeed,
  waitForFirstArticleVisible,
  openArticlesPage,
} from './hw14-qa-dojo-articles-functions-arrays-editor-page-actions';

test.describe('Articles Create', { tag: '@hw23:global-setup' }, () => {
  // test.use({ storageState: { cookies: [], origins: [] } });

  test.use({ storageState: 'playwright/.auth/user.json' });

  test('Multiple Articles Created and visible on Global/Feed Lists', async ({
    page,
  }) => {
    await openArticlesPage(page);
    await createMultipleArticles(page, 3);
    await goToArticlesHomePage(page);
    await goToGlobalFeed(page);
    await waitForFirstArticleVisible(page);
  });
});
