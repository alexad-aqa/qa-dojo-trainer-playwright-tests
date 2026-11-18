import { test, expect } from '../fixtures/my-fixture';
import { ArticleLongReadPage } from '../page-objects/pages/ArticleLongReadPage';
import { ArticlesHomePage } from '../page-objects/pages/ArticlesHomePage';
import { EditorsPage } from '../page-objects/pages/EditorsPage';

test.describe(
  'hw26: QA Dojo: API route mocking',
  { tag: '@hw26:api-route' },
  () => {
    test('Articles Data Updated via route.continue', async ({ authedPage }) => {
      const articlesHomePage = new ArticlesHomePage(authedPage);
      const editorsPage = new EditorsPage(authedPage);
      const articleLongReadPage = new ArticleLongReadPage(authedPage);

      const randomNumber = Math.floor(Math.random() * 1000000);
      const title = `aqa_${randomNumber}`;
      const description = `aqa`;
      const body = `aqa`;
      const tag = ['automation', 'api', 'route'];

      const articlePayload = {
        article: {
          title: `aqa_UPD_via_ROUTE${randomNumber}`,
          description: 'aqa UPD_via_ROUTE',
          body: 'aqa UPD_via_ROUTE',
          tagList: ['automation', 'api', 'route'],
          category: 'general',
          visibility: 'public',
          allowComments: true,
          cover: '',
        },
      };

      const expectedTags = [...articlePayload.article.tagList].sort();

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
          });
        },
      );
      //* Validations on Article Long Read Page

      await editorsPage.createArticle(title, description, body, tag.join(','));

      await expect(articleLongReadPage.articleTitle).toHaveText(
        articlePayload.article.title,
      );
      await expect(articleLongReadPage.articleDescription).toContainText(
        articlePayload.article.description,
      );
      await expect(articleLongReadPage.articleBody).toContainText(
        articlePayload.article.body,
      );
      await expect(articleLongReadPage.articleTags).toHaveText(expectedTags);

      await articleLongReadPage.header.goToArticlesHomePage();
      await articlesHomePage.goToGlobalFeed();

      //* Validations on Articles Home Page > Global Tab
      await expect(articlesHomePage.articleList).toContainText(
        articlePayload.article.title,
      );
      await expect(articlesHomePage.articleList).toContainText(
        articlePayload.article.description,
      );
      await expect(articlesHomePage.articleList).not.toContainText(title);
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
        async (route, request) => {
          if (request.method() !== 'GET') {
            return route.continue();
          }

          await route.fulfill({
            json: { articles: [mockedArticle], articlesCount: 1 },
            status: 200,
          });
        },
      );

      await authedPage.goto(`/articles/`);

      await expect(articlesHomePage.articlePreviewCard).toHaveCount(1);
      await expect(articlesHomePage.articleList).toContainText(
        mockedArticle.title,
      );

      await expect(articlesHomePage.articleList).toContainText(
        mockedArticle.description,
      );
    });
  },
);
