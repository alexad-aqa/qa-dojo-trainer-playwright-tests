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

// *** Articles Home Page Locators & Actions *** 

async function getArticlePageLocators(page: Page) {
    const globalFeedTab = page.getByTestId('feed-tab-global');
    const previewArticleTitle = page.getByTestId(/preview-title/);
    const searchInput = page.getByTestId('home-search-input');
    const followBtn = page.getByTestId('article-follow-button');
    const applySearchBtn = page.getByTestId('home-filter-apply');
    const paginationTxtLinks = page.getByTestId(/pagination-page/);

    return {
        globalFeedTab,
        previewArticleTitle,
        searchInput,
        followBtn,
        applySearchBtn,
        paginationTxtLinks
    }
};

export async function goToGlobalFeed(page: Page) {
    const articlesPage = await getArticlePageLocators(page);
    await articlesPage.globalFeedTab.click();
}

export async function readFirstArticle(page: Page) {
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

export async function fillTitleEditor(page: Page, title) {
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
    await waitForEditBtnVisible(page);
};

export async function waitForEditBtnVisible(page: Page) {
    const editorPageLocators = await getEditorPageLocators(page);
    await editorPageLocators.editBtn.waitFor({ state: 'visible', timeout: 3000 });
};

export async function createMultipleArticles(page: Page) {
    const titles = [];
    const randomNumber = Math.floor(Math.random() * 1000000);
    for (let i = 1; i <= 10; i++) {
        const title = `aqa1_${randomNumber}-${i}`;
        const description = `aqa1-${i}`;
        const body = `aqa1-${i}`;
        const tag = ['automation, functions, arrays'];

        await goToEditorPage(page);
        await createArticle(page, title, description, body, tag.toString());
        titles.push(title);
        //await waitForEditBtnVisible(page);
    }
}

