import {
  test as playwrightTest,
  request,
  expect,
  APIRequestContext,
} from '@playwright/test';
import { UserController } from '../controllers/UserController';
import { BasePage } from '../page-objects/pages/BasePage';
import { ProfilePage } from '../page-objects/pages/ProfilePage';
import { SettingsPage } from '../page-objects/pages/SettingsPage';

type MyFixtures = {
  authTokenOnReg: any;
  authTokenOnLogin: any;
  apiClientRegContext: APIRequestContext;
  apiClientLoginContext: APIRequestContext;
  localStorageSetup: any; // ts off
  basePage: BasePage;
  profilePage: ProfilePage;
  settingsPage: SettingsPage;
  authedPage: any;
};

export const test = playwrightTest.extend<MyFixtures>({
  //* initialize PAGES

  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },

  profilePage: async ({ authedPage }, use) => {
    await use(new ProfilePage(authedPage));
  },

  settingsPage: async ({ authedPage }, use) => {
    await use(new SettingsPage(authedPage));
  },

  //* create STATES Before Tests

  authTokenOnReg: async ({ request }, use) => {
    const userController = new UserController(request);

    const username = `aqa_${Date.now()}`;
    const email = `user_${Date.now()}@example.com`;

    const response = await userController.registerUserApi({
      user: {
        username: username,
        email: email,
        password: 'password123',
      },
    });

    const tokenOnReg = response.token;

    await use({
      token: tokenOnReg,
      username: username,
      email: email,
      response: response,
    });
  },

  authTokenOnLogin: async ({ request }, use) => {
    //const apiContext = await request.newContext();
    const userController = new UserController(request);

    const tokenOnLogin = await userController.loginUserApi({
      user: {
        email: 'olena@example.com',
        password: 'password',
      },
    });

    await use(tokenOnLogin);
  },

  apiClientRegContext: async ({ authTokenOnReg }, use) => {
    const apiContext = await request.newContext({
      extraHTTPHeaders: {
        authorization: 'Token ' + authTokenOnReg,
      },
    });

    await use(apiContext);

    await apiContext.dispose();
  },

  apiClientLoginContext: async ({ authTokenOnLogin }, use) => {
    const apiContext = await request.newContext({
      extraHTTPHeaders: {
        authorization: 'Token ' + authTokenOnLogin,
      },
    });

    await use(apiContext);

    await apiContext.dispose();
  },

  localStorageSetup: async ({ baseURL }, use) => {
    //const targetUrl = baseURL || 'http://localhost:3000';
    const originUrl = new URL(baseURL).origin;

    const setup = (token) => {
      return {
        cookies: [],
        origins: [
          {
            origin: originUrl,
            localStorage: [{ name: 'qa-dojo.token', value: token }],
          },
        ],
      };
    };
    await use(setup);
  },

  authedPage: async ({ browser, authTokenOnReg, localStorageSetup }, use) => {
    const { token } = authTokenOnReg;
    const myState = localStorageSetup(token);
    const context = await browser.newContext({ storageState: myState });
    const page = await context.newPage();
    await use(page);

    // await page.close();
    // await context.close();
  },
});

//* function from lecture

export function createLocalStorage(baseUrl: string, token: string) {
  return {
    cookies: [],
    origins: [
      {
        origin: new URL(baseUrl!).origin,
        localStorage: [{ name: 'qa-dojo.token', value: token }],
      },
    ],
  };
}

export { expect };
