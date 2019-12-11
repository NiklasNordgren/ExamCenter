/*import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {

    // Url of the Identity Provider
    //issuer: '/sso',
    issuer: 'https://steyer-identity-server.azurewebsites.net/identity',
    //issuer: 'http://md.nordu.net/swamid.ds?entityID=https%3A%2F%2Flms.hig.se%2Fshibboleth-sp&return=https%3A%2F%2Flms.hig.se%2FShibboleth.sso%2FLogin%3FSAMLDS%3D1%26target%3Dss%253Amem%253Aa94284398e51170da5fdfe6ee121d340ccb5624ed1228c97404b3fbd082de70f',
    //requireHttps: false,

    // URL of the SPA to redirect the user to after login
    redirectUri: window.location.origin,

    logoutUrl: window.location.origin + 'index.html',

    // The SPA's id. The SPA is registered with this id at the auth-server
    clientId: 'spa-demo',

    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'openid profile email voucher',
}
*/
