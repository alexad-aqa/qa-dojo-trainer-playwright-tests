import { APIRequestContext } from '@playwright/test';

export class UserController {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async registerUserApi(userRegData) {
    console.log('--- DEBUG USER DATA ---', userRegData);
    const responseOnRegRequest = await this.request.post('/api/users', {
      data: userRegData,
      failOnStatusCode: true,
    });

    const regRequestJson = await responseOnRegRequest.json();
    const authTokenOnReg = regRequestJson.user.token;
    return authTokenOnReg;
  }

  async loginUserApi(userLoginData) {
    const responseOnLoginRequest = await this.request.post('/api/users/login', {
      data: {
        user: userLoginData,
      },
      failOnStatusCode: true,
    });

    const loginRequestJson = await responseOnLoginRequest.json();
    const authTokenOnLogin = loginRequestJson.user.token;
    return authTokenOnLogin;
  }
}
