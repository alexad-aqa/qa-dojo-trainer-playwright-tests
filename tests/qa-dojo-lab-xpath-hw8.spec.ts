import {test, expect} from '@playwright/test'; 

test.describe('Sorting+ChBox+Xpath', {tag: '@hw8:xpath'}, () => {
    let table;
    
    let testColItems;
    let testColSortIcon;

    let statusColItems;
    let statusColSortIcon;

    let durationColItems;
    let durationColSortIcon;

    let tableCheckbox;
    let selectedCount;


    test.beforeEach(async ({page}) => {
        await page.goto('/laboratory/interactions');

        table = page.locator('//*[@data-testid="interactions-table"]');
            await table.waitFor({ state: 'visible' });

        testColItems = page.locator('//*[@class = "px-5 py-3 font-semibold"]');
        testColSortIcon = page.locator('//*[@data-testid="interactions-sort-name"]');

        statusColItems = page.locator("//td[.//span[contains(@class, 'rounded-full')]]");
        statusColSortIcon = page.locator('//*[@data-testid="interactions-sort-status"]'); 

        durationColItems = page.locator('//*[@class = "px-5 py-3 tabular-nums"]');
        durationColSortIcon = page.locator('//*[@data-testid="interactions-sort-duration"]');

        tableCheckbox = page.locator('//input[contains(@data-testid, "interactions-row-select")]');
        selectedCount = page.locator('//*[@data-testid="interactions-selected-count"]');

    });

    test('Test Col Sorted A-Z by default', async({page}) => {   
        const testColItemsAscDefault = await testColItems.allTextContents();
        const sortedTestColItemsAsc = [...testColItemsAscDefault].sort((a,b) => a.localeCompare(b));
            await expect(testColItemsAscDefault).toEqual(sortedTestColItemsAsc);  
    });

    test('Test Col sorted Z-A', async({page})=> {
        const testColItemsAscDefault = await testColItems.allTextContents();
        const sortedTestColItemsDesc = [...testColItemsAscDefault].sort((a,b) => b.localeCompare(a));
            await testColSortIcon.click();
        const sortedTestColItemsDescUI = await testColItems.allTextContents();
            await expect(sortedTestColItemsDescUI).toEqual(sortedTestColItemsDesc);
    });

    test('Status Col sorted A-Z', async({page}) => {
        const statusColItemsInitial = await statusColItems.allTextContents();
        const sortedStatusColItemsAsc = [...statusColItemsInitial].sort((a,b) => a.localeCompare(b));
            await statusColSortIcon.click();
        const sortedStatusColItemsAscUI = await statusColItems.allTextContents();
            await expect(sortedStatusColItemsAscUI).toEqual(sortedStatusColItemsAsc);
    });

    test('Status Col sorted Z-A', async ({page}) => {
        const statusColItemsInitial = await statusColItems.allTextContents();
        const sortedStatusColItemDesc = [...statusColItemsInitial].sort((a,b) => b.localeCompare(a));
            await statusColSortIcon.dblclick();
        const sortedStatusColItemsDescUI = await statusColItems.allTextContents();
            await expect(sortedStatusColItemsDescUI).toEqual(sortedStatusColItemDesc);
    });

    test('Duration Col sorted 0-9', async ({page}) => {
        const durationColItemsInitial = await (await durationColItems.allTextContents()).map(item => parseFloat(item));
        const sortedDurationColItemsAsc = [...durationColItemsInitial].sort((a,b) => a - b);
            await durationColSortIcon.click();
        const sortedDurationColItemsAscUI = await (await durationColItems.allTextContents()).map(item => parseFloat(item));
            await expect(sortedDurationColItemsAscUI).toEqual(sortedDurationColItemsAsc);
    });

    test('Duration Col sorted 9-0', async({page}) => {
        const durationColItemsInitial = await (await durationColItems.allTextContents()).map(item => parseFloat(item));
        const sortedDurationColItemsDesc = [...durationColItemsInitial].sort((a,b) => b - a);
            await durationColSortIcon.dblclick();
        const sortedDurationColItemsDescUI = await (await durationColItems.allTextContents()).map(item => parseFloat(item));
            await expect(sortedDurationColItemsDescUI).toEqual(sortedDurationColItemsDesc);
        
    });

    test(' 1st Checkbox Selected & Counter Increased +1', async({page}) => {
        await tableCheckbox.nth(0).check();
        await expect(await selectedCount).toContainText('1');
    });

    test('Checkbox Selected 1 by 1 & Counter Increased +1', async({page}) => {
        const totalCheckboxes = await tableCheckbox.count();
          for (let i = 0; i < totalCheckboxes; i++) {
            await tableCheckbox.nth(i).check();
        const expectedValue = (i + 1).toString();
            await expect(selectedCount).toContainText(expectedValue);
          }
    });
});