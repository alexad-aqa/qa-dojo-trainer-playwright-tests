import { test, expect } from '../fixtures/my-fixture';
import { ProfilePage } from '../page-objects/pages/ProfilePage';
import { SettingsPage } from '../page-objects/pages/SettingsPage';

test.describe(
  'hw25: QA Dojo: New User + Settings Update',
  { tag: '@hw25:api' },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('User Registered via API & Profile Photo updated via UI', async ({
      authTokenOnReg,
      authedPage,
    }) => {
      const { token, username, email, response } = authTokenOnReg;

      const profilePage = new ProfilePage(authedPage);
      const settingsPage = new SettingsPage(authedPage);

      await test.step('User Registered, Auth Token exists/and not NULL', async ({}) => {
        // console.log(token);
        //console.log(username);
        expect(response.token).toBeTruthy();
        expect(response.username).toBe(username);
        expect(response.email).toBe(email);
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

      await test.step('Go To Profile Settings & Verify User Data', async () => {
        await profilePage.openProfileSettingPage();
        await settingsPage.verifyUsername(username);
        await settingsPage.verifyEmail(email);
      });

      const prefix = await test.step('Upload Avatar', async () => {
        //const pathToFile = 'qa-dojo-trainer-hw/test-files/owl.jpeg'; //works if run via Run code
        const pathToFile = 'test-files/owl.jpeg'; // works if run via npx ...
        await settingsPage.uploadFile(pathToFile);
        const prefix = await settingsPage.getAvatarAddressPrefix();
        await settingsPage.submitSettings();
        await profilePage.verifyAvatar(prefix);
        return prefix;
      });

      await test.step('Verifications after Profile Settings Page Reload', async () => {
        const urlAfterSubmit = authedPage.url();
        console.log(urlAfterSubmit);
        if (!urlAfterSubmit.includes('/articles/settings')) {
          //await authedPage.goto('/articles/settings');
          await profilePage.openProfileSettingPage();
        } else {
          await authedPage.reload();
        }
        await settingsPage.verifyAvatarUploaded(prefix);
      });
    });
  },
);
