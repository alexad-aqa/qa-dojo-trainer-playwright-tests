import { test, expect } from '../fixtures/my-fixture';
import { ArticleLongReadPage } from '../page-objects/pages/ArticleLOngReadPage';
import { ArticlesHomePage } from '../page-objects/pages/ArticlesHomePage';
import { EditorsPage } from '../page-objects/pages/EditorsPage';
import { ProfilePage } from '../page-objects/pages/ProfilePage';
import { SettingsPage } from '../page-objects/pages/SettingsPage';

test.describe(
  'hw26: QA Dojo: Create Article',
  { tag: '@hw26:api-route' },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('Articles Data Updated via route.continue', async ({
      authedPage,
      //articlesHomePage,
      //editorsPage,
    }) => {
      const articlesHomePage = new ArticlesHomePage(authedPage);
      const editorsPage = new EditorsPage(authedPage);
      const articleLongReadPage = new ArticleLongReadPage(authedPage);

      const randomNumber = Math.floor(Math.random() * 1000000);
      const title = `aqa_${randomNumber}`;
      const description = `aqa`;
      const body = `aqa`;
      const tag = ['automation, api, route'];

      const articlePayload = {
        article: {
          title: `aqa_UPD_via_ROUTE${randomNumber}`,
          description: 'aqa UPD_via_ROUTE',
          body: 'aqa UPD_via_ROUTE',
          tagList: ['automation, api, route'],
          category: 'general',
          visibility: 'public',
          allowComments: true,
          cover: '',
        },
      };

      await authedPage.goto(`/articles/`);
      await articlesHomePage.header.goToEditorPage();
      await authedPage.route(
        (url) => url.pathname === '/api/articles',
        async (route, request) => {
          if (request.method() !== 'POST') {
            return route.continue();
          }

          await route.continue({
            postData: articlePayload,
            headers: request.headers(),
            method: request.method(),
            url: request.url(),
          });
        },
      );

      await editorsPage.createArticle(title, description, body, tag);
      await expect(articleLongReadPage.articleTitle).toHaveText(
        articlePayload.article.title,
      );
      await expect(articleLongReadPage.articleDescription).toContainText(
        articlePayload.article.description,
      );
      await expect(articleLongReadPage.articleBody).toContainText(
        articlePayload.article.body,
      );
      await expect(articleLongReadPage.articleTags).toContainText(
        articlePayload.article.tagList.toString(),
      );
      await articleLongReadPage.header.goToArticlesHomePage();
      await articlesHomePage.goToGlobalFeed();

      await expect(articlesHomePage.articleLIst).toContainText(
        articlePayload.article.title.toString(),
      );

      await expect(articlesHomePage.articleLIst).toContainText(
        articlePayload.article.description.toString(),
      );
    });

    test('Article Data is mocked with route.fulfill', async ({
      authedPage,
    }) => {
      const articlesHomePage = new ArticlesHomePage(authedPage);

      const mockedArticle = {
        slug: 'aqaupdviaroute958719',
        title: 'aqa_UPD_via_FULFILL',
        description: 'aqa_UPD_via_FULFILL',
        body: 'aqa UPD_via_ROUTE',
        tagList: ['automation', 'api', 'route'],
        category: 'general',
        visibility: 'public',
        allowComments: true,
        cover: '',
        createdAt: '2026-11-12T17:58:36.118Z',
        updatedAt: '2026-11-12T17:58:36.118Z',
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'aqa_1794506312627',
          bio: '',
          image: '/avatar-placeholder.svg',
          following: false,
        },
      };
      await authedPage.route(
        (url) => url.pathname === '/api/articles',
        //'**/api/articles?**', // без query
        async (route, request) => {
          if (request.method() !== 'GET') {
            return route.continue();
          }
          // async (route, request) => {
          //   const response = await route.fetch();

          await route.fulfill({
            json: { articles: [mockedArticle], articlesCount: 1 },
            status: 200,
          });
        },
      );

      await authedPage.goto(`/articles/`);
      await authedPage.waitForResponse('**/api/articles?**');
      await expect(articlesHomePage.articleLIst).toContainText(
        mockedArticle.title.toString(),
      );

      await expect(articlesHomePage.articleLIst).toContainText(
        mockedArticle.description.toString(),
      );
    });
  },
);
