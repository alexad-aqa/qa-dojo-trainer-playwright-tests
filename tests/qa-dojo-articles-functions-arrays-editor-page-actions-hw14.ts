import { Page } from '@playwright/test';

// *** HEADER Locators & Actions ***

async function getHeaderLocators(page: Page) {
    const userProfile_Header = page.getByTestId('nav-profile');
    const newArticleTxtLink_Header = page.getByTestId('nav-new-article');
    const homeTxtLink_Header = page.getByTestId('nav-home');

    return {
        userProfile_Header,
        newArticleTxtLink_Header,
        homeTxtLink_Header
    }
};

export async function goToArticlesHomePage(page: Page) {
    const headerLocators = await getHeaderLocators(page);
    await headerLocators.homeTxtLink_Header.click();
}

export async function goToEditorPage(page: Page) {
    const headerLocators = await getHeaderLocators(page);
    await headerLocators.newArticleTxtLink_Header.click()
}

// *** Editors PAGE Locators & Actions ***

async function getEditorPageLocators(page: Page) {

    const title = page.getByTestId('editor-title');
    const description = page.getByTestId('editor-description');
    const body = page.getByTestId('editor-body');
    const tag = page.getByTestId('editor-tags')
    const submitArticleBtn = page.getByTestId('editor-submit');
    const editBtn = page.getByTestId('edit-article-button')

    return {
        title,
        description,
        body,
        tag,
        submitArticleBtn,
        editBtn
    };
};

async function fillTitleEditor(page: Page, title) {
    const editorPageLocators = await getEditorPageLocators(page);
    await editorPageLocators.title.fill(title);
};

async function fillDescriptionEditor(page: Page, description) {
    const editorPageLocators = await getEditorPageLocators(page);
    await editorPageLocators.description.fill(description);
};

async function fillBodyEditor(page: Page, body) {
    const editorPageLocators = await getEditorPageLocators(page);
    await editorPageLocators.body.fill(body);
};

async function fillTagEditor(page: Page, tag) {
    const editorPageLocators = await getEditorPageLocators(page);
    await editorPageLocators.tag.fill(tag);
};

async function submitEditor(page: Page) {
    const editorPageLocators = await getEditorPageLocators(page);
    await editorPageLocators.submitArticleBtn.click();
};

export async function createArticle(page: Page, title, description, body, tag) {

    await fillTitleEditor(page, title);
    await fillDescriptionEditor(page, description);
    await fillBodyEditor(page, body);
    await fillTagEditor(page, tag);
    await submitEditor(page);
    await waitForArticleEditBtnVisible(page);
};

async function waitForArticleEditBtnVisible(page: Page) {
    const editorPageLocators = await getEditorPageLocators(page);
    await editorPageLocators.editBtn.waitFor({ state: 'visible', timeout: 5000 });
};

export async function createMultipleArticles(page: Page, articleQty) {
    const myTitles = [];
    const randomNumber = Math.floor(Math.random() * 1000000);
    for (let i = 1; i <= articleQty; i++) {
        const title = `aqa1_${randomNumber}-${i}`;
        const description = `aqa1-${i}`;
        const body = `aqa1-${i}`;
        const tag = ['automation, functions, arrays'];

        await goToEditorPage(page);
        await createArticle(page, title, description, body, tag.toString());
        myTitles.push(title);
        //await waitForArticleEditBtnVisible(page);
    }
    return myTitles
};

// *** Articles Home Page Locators & Actions *** 

async function getArticlePageLocators(page: Page) {
    const globalFeedTab = page.getByTestId('feed-tab-global');
    const previewArticleTitle = page.getByTestId(/preview-title/);
    const searchInput = page.getByTestId('home-search-input');
    const followBtn = page.getByTestId('article-follow-button');
    const applySearchBtn = page.getByTestId('home-filter-apply');
    const paginationTxtLinks = page.getByTestId(/pagination-page/);
    const paginationBar = page.getByTestId('pagination');

    return {
        globalFeedTab,
        previewArticleTitle,
        searchInput,
        followBtn,
        applySearchBtn,
        paginationTxtLinks,
        paginationBar
    }
};

export async function goToGlobalFeed(page: Page) {
    const articlesPage = await getArticlePageLocators(page);
    await articlesPage.globalFeedTab.click();
}

async function readFirstArticle(page: Page) {
    const articlesPage = await getArticlePageLocators(page);
    await articlesPage.previewArticleTitle.first().click();
}

async function typeSearchKeyword(page: Page, keyword) {
    const articlesPage = await getArticlePageLocators(page);
    await articlesPage.searchInput.fill(keyword)
}

async function applySearch(page: Page) {
    const articlesPage = await getArticlePageLocators(page);
    await articlesPage.applySearchBtn.click()
}

export async function followUser(page: Page) {
    const articlesPage = await getArticlePageLocators(page);
    await articlesPage.followBtn.click()
}

export async function searchArticleByName(page: Page, keyword) {
    await typeSearchKeyword(page, keyword);
    await applySearch(page)
}

export async function goToArticleLongRead(page: Page, keyword) {
    await searchArticleByName(page, keyword);
    await readFirstArticle(page);
}

export async function waitForFirstArticleVisible(page: Page) {
    const articlesPage = await getArticlePageLocators(page);
    await articlesPage.previewArticleTitle.first().waitFor({ state: 'visible', timeout: 3000 });
}

export async function findArticlesAcrossGlobalPages(page: Page, myTitles) {
    const articlesPage = await getArticlePageLocators(page);

    const foundTitles = [];
    //const pagination = await articlesPage.paginationTxtLinks;
    const paginationCount = await articlesPage.paginationTxtLinks.count();

    for (let i = 0; i < paginationCount; i++) {

        const currentPage = articlesPage.paginationTxtLinks.nth(i);
        
        const pageNumber = await articlesPage.paginationTxtLinks.nth(i).textContent();
        console.log(`Go to Global page #: ${pageNumber}`);

        await currentPage.click();
        await waitForFirstArticleVisible(page);

        const previewTitlesGlobalPage = await articlesPage.previewArticleTitle.allTextContents();

        for (const title of previewTitlesGlobalPage) {
            if (myTitles.includes(title)) {
                console.log(`Found on Global page: ${pageNumber}: ${title}`);

                if (!foundTitles.includes(title)) {
                    foundTitles.push(title);
                }
            }
        }
        if (foundTitles.length === myTitles.length) break;
    }

    return foundTitles
}

export async function findArticlesAcrossFeedPages(page: Page, myTitles) {

    const foundTitles = [];
    const articlesPage = await getArticlePageLocators(page);
    await waitForFirstArticleVisible(page);
    const paginationPresent = await articlesPage.paginationBar.isVisible();

    let pageCount = 1;

    if (paginationPresent) {
        pageCount = await articlesPage.paginationTxtLinks.count();
    }

    for (let i = 0; i < pageCount; i++) {
        const pageNumber = i + 1;

        if (i > 0) {

            await articlesPage.paginationTxtLinks.nth(i).click();
            await waitForFirstArticleVisible(page);
            console.log(`Go to Feed Page #: ${pageNumber}`);
        }

        const previewTitlesFeedPage = await articlesPage.previewArticleTitle.allTextContents();

        for (const title of previewTitlesFeedPage) {
            if (myTitles.includes(title) && !foundTitles.includes(title)) {
                console.log(`Found on Feed page ${pageNumber}: ${title}`);
                foundTitles.push(title);
            }
        }

        if (foundTitles.length === myTitles.length) break;
    }

    return foundTitles;
}




