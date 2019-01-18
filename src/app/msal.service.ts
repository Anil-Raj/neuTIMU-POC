import { Injectable } from '@angular/core';
import * as Msal from 'msal';

@Injectable({
  providedIn: 'root'
})
export class MsalService {

  constructor() { }
  B2CTodoAccessTokenKey = 'e*A&6XR6"#TC>J_SkeB,A]|o';

  tenantConfig = {
    tenant: 'neutimu.onmicrosoft.com', 
    clientId: '68bc3407-4574-42e7-a3f6-7f136e61d64b',
    endpoints: {
      'https://graph.microsoft.com': '00000003-0000-0000-c000-000000000000'
    },
    navigateToLoginRequestUrl: false,
    redirectUri: 'http://localhost:4200',
      signUpSignInPolicy: 'neuEstimate',
      b2cScopes: ['https://neutimu.onmicrosoft.com/api/user_impersonation']
  };

  // Configure the authority for Azure AD B2C
  authority = 'https://login.microsoftonline.com/tfp/' + this.tenantConfig.tenant + '/' + this.tenantConfig.signUpSignInPolicy;

  /*
   * B2C SignIn SignUp Policy Configuration
   */
  clientApplication = new Msal.UserAgentApplication(
      this.tenantConfig.clientId, this.authority,
      function (errorDesc: any, token: any, error: any, tokenType: any) {
          // Called after loginRedirect or acquireTokenPopup
      }
  );

  public login(): void {
      var _this = this;
      this.clientApplication.loginPopup(this.tenantConfig.b2cScopes).then(function (idToken: any) {
          _this.clientApplication.acquireTokenSilent(_this.tenantConfig.b2cScopes).then(
              function (accessToken: any) {
                  _this.saveAccessTokenToCache(accessToken);
              }, function (error: any) {
                  _this.clientApplication.acquireTokenPopup(_this.tenantConfig.b2cScopes).then(
                      function (accessToken: any) {
                          _this.saveAccessTokenToCache(accessToken);
                      }, function (error: any) {
                          // bootbox.alert('Error acquiring the popup:\n' + error);
                      });
              })
      }, function (error: any) {
          // bootbox.alert('Error during login:\n' + error);
      });
  }

  saveAccessTokenToCache(accessToken: string): void {
      sessionStorage.setItem(this.B2CTodoAccessTokenKey, accessToken);
  };

  logout(): void {
      this.clientApplication.logout();
  };

  isOnline(): boolean {
      return this.clientApplication.getUser() != null; 
  };
}
