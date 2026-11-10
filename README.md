# QA Dojo Trainer Playwright Tests

## Install

npm ci

npm init playwright@latest

## Run Codegen

npx playwright codegen http://104.168.59.50/articles

## Run tests

npx playwright test qa-dojo-trainer-hw/tests/hw25-qa-dogo-articles-api.spec.ts

## Report

npx playwright show-report

## hw8(25) API Request

Before Test:

1. Test checks authTokenOnReg Fixture present as Argument and preforms Registration of User#1 via API '/api/users' (via registerUserApi Controller)
   =>> authTokenOnReg is fetched From Response & passed into api context
   =>> USERNAME#1 fetched and passed into next test steps

2. apiContext #1 created via apiClientRegContext Fixture using authTokenOnReg
   --- in This Context: - Multiple Articles (3) Created via /api/articles (using Fixture);
   =>> Article Names fetched From Response and saved into var - Verification that articles created via API by querying /api/articles?sort=newest&limit=n&offset=n  
    - Context Closed with await apiContext.dispose();

Test Steps:
API

1. User#2 registered via API '/api/users' (via registerUserApi Controller )
   ==> authTokenOnReg is fetched From Response & passed into api context

2. apiContext #2 created via apiClientRegContext Fixture using authTokenOnReg
   --- in This Context: - User#2 follows User#1 via POST: /api/profiles/${USERNAME#1}/follow
   --- Context Closed with await apiContext.dispose();

UI

- New Page Context Created via Fixture authedPage
- authTokenOnReg set into Page Local Storage
  --- in This Context: - User#2 proceeds to http://104.168.59.50/articles - Goes to Your Feed Tab - Checks Multiple Articles (3) present on list
  --- Page Context Closed
