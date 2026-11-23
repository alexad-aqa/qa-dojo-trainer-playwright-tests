import { expect, test } from '@playwright/test';

test.describe('Zara', { tag: '@hw23:cookies' }, () => {
  test('Zara: Cookies Test', async ({ page, context }) => {
    await test.step('Zara: GET cookies & check length', async ({}) => {
      await page.goto('https://www.zara.com/es/en/');
      await test.info().attach('zara-on-load', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      const acceptCookiesButton = page.getByRole('button', {
        name: 'Accept All Cookies',
      });

      const isBannerShown = await acceptCookiesButton
        .waitFor({ state: 'visible', timeout: 10000 })
        .then(() => true)
        .catch(() => false);

      if (isBannerShown) {
        await acceptCookiesButton.click();
        console.log('Cookies Accepted');
      } else {
        console.log(
          'Cookie banner NOT shown. URL:',
          page.url(),
          '| Title:',
          await page.title(),
        );
      }

      const continueButton = page.getByRole('button', {
        name: 'Yes, continue on Spain',
      });
      const isShown = await continueButton
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false);

      if (isShown) {
        await continueButton.click();
      }
      console.log('Country popup shown:', isShown);

      const cookies = await context.cookies();
      console.log('----- INITIAL GET cookies count ------ ' + cookies.length);
      expect(cookies.length).toBeGreaterThan(0);
    });

    await test.step(`Zara: CREATE my Cookie & check it's added `, async ({}) => {
      const myCookie = [
        {
          name: 'CookiesConsent-owle',
          value: 'C0001%3BC0002%3BC0003%3BC0005',
          domain: '.www.zara.com',
          path: '/',
          expires: 1825332646,
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ];

      await context.addCookies(myCookie);

      const cookie = await context.cookies();

      const myFoundCookie = cookie.find(
        (item) =>
          item.name === 'CookiesConsent-owle' &&
          item.domain === '.www.zara.com',
      );

      expect(myFoundCookie).toBeTruthy();
      expect(myFoundCookie.name).toBe('CookiesConsent-owle');
      expect(myFoundCookie.value).toBe('C0001%3BC0002%3BC0003%3BC0005');

      //* assertion option 2
      // expect(cookie).toContainEqual(
      //   expect.objectContaining({
      //     name: 'CookiesConsent-owle',
      //     value: 'C0001%3BC0002%3BC0003%3BC0005',
      //   }),
      // );

      //* assertion option 3
      //expect(myFoundCookie).toEqual(myCookie[0]);

      console.log(
        '----- MY CREATed COOKIE found ------',
        cookie.length,
        myFoundCookie.name,
        myFoundCookie.value,
      );
    });

    await test.step(`Zara: UPDATE #1 my Cookie & check it's updated `, async ({}) => {
      const cookies = await context.cookies();

      const myUpdatedCookies = cookies.map((cookie) => {
        const isTarget =
          cookie.name === 'CookiesConsent-owle' &&
          cookie.domain === '.www.zara.com' &&
          cookie.path === '/';

        if (isTarget) {
          return {
            ...cookie,
            value: 'updated',
          };
        }

        return cookie;
      });

      await context.clearCookies();
      await context.addCookies(myUpdatedCookies);

      const cookie = await context.cookies();

      const myFoundCookie = cookie.find(
        (item) =>
          item.name === 'CookiesConsent-owle' &&
          item.domain === '.www.zara.com',
      );
      console.log(
        '----- MY UPDATED #1 COOKIE  FOUND ------' + cookie.length,
        myFoundCookie.name,
        myFoundCookie.value,
      );

      expect(myFoundCookie).toBeTruthy();
      expect(myFoundCookie.value).toBe('updated');
    });

    await test.step(`Zara: UPDATE #2 my Cookie & check it's updated `, async ({}) => {
      const cookie = await context.cookies();

      const myFoundCookie2 = cookie.find(
        (item) =>
          item.name === 'CookiesConsent-owle' &&
          item.domain === '.www.zara.com',
      );

      if (myFoundCookie2) {
        const myUpdatedCookie2 = {
          ...myFoundCookie2,
          value: 'updated-#2',
        };

        //await context.clearCookies();
        await context.addCookies([myUpdatedCookie2]);
      }

      const postUpdateCookie = await context.cookies();

      const myFoundCookieAfterUpdate2 = postUpdateCookie.find(
        (item) =>
          item.name === 'CookiesConsent-owle' &&
          item.domain === '.www.zara.com',
      );

      console.log(
        '----- MY UPDATED #2 COOKIE FOUND ------' + postUpdateCookie.length,
        myFoundCookieAfterUpdate2.name,
        myFoundCookieAfterUpdate2.value,
      );

      expect(myFoundCookieAfterUpdate2).toBeTruthy();
      expect(myFoundCookieAfterUpdate2.name).toBe('CookiesConsent-owle');
      expect(myFoundCookieAfterUpdate2.value).toBe('updated-#2');
    });

    await test.step(`Zara: DELETE myCookie & check it does not exist`, async ({}) => {
      await context.clearCookies({ name: 'CookiesConsent-owle' });

      const cookiesAfterClear = await context.cookies();
      //console.log(cookiesAfterClear);
      const deletedCookieCheck = cookiesAfterClear.find(
        (item) =>
          item.name === 'CookiesConsent-owle' &&
          item.domain === '.www.zara.com',
      );
      //await page.reload();
      expect(deletedCookieCheck).toBeUndefined();
      console.log(
        '------My Cookie DELETED ------- ' + cookiesAfterClear.length,
      );
    });
  });
});
