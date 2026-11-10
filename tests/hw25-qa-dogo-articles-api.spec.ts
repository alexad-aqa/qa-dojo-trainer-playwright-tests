import { test, expect } from '../fixtures/my-fixture';

test.describe(
  'hw25: QA Dojo: New User + Settings Update',
  { tag: '@hw25:api' },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('User Registered via API & Profile Photo updated via UI', async ({
      authTokenOnReg,
      authedPage,
      profilePage,
      settingsPage,
    }) => {
      const { token, username } = authTokenOnReg;

      await test.step('User Registered, Auth Token exists/and not NULL', async ({}) => {
        // console.log(token);
        //console.log(username);
        expect(token).toBeDefined();
        expect(token).not.toBeNull();
      });

      await test.step('Auth Token set in LocalStorage & Page Context created & Profile Page Opened ', async () => {
        await authedPage.goto(`/articles/profile/${username}`);
        await expect
          .poll(async () => {
            return await authedPage.evaluate(() =>
              window.localStorage.getItem('qa-dojo.token'),
            );
          })
          .toBe(token);
        await expect(authedPage).toHaveURL(`/articles/profile/${username}`);
        await profilePage.header.verifyProfileUsername(username);
        await profilePage.verifyUsername(username);
      });

      const prefix =
        await test.step('Go To Profile Settings & Upload file', async () => {
          await profilePage.openProfileSettingPage();
          await settingsPage.uploadFile('test-files/owl.jpeg');
          // await settingsPage.uploadFile(
          //   'tests/qa-dojo-trainer-hw/test-files/owl.jpeg',
          // );
          const prefix = await settingsPage.getAvatarAddressPrefix();
          await settingsPage.submitSettings();
          await profilePage.verifyAvatar(prefix);
          return prefix;
        });

      await test.step('Verifications after Profile Settings Page Reload', async ({}) => {
        await profilePage.openProfileSettingPage();
        await authedPage.reload();
        const urlAfterReload = authedPage.url();
        if (!urlAfterReload.endsWith(`/articles/profile/${username}`)) {
          await authedPage.goto(`/articles/profile/${username}`);
        }
        await expect(authedPage).toHaveURL(`/articles/profile/${username}`);
        await profilePage.verifyAvatar(prefix);
      });
    });
  },
);
