import { Component, OnInit } from '@angular/core';
//import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
//import { authConfig } from '../sso.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //TODO: Remove router when SSO is implemented
  constructor(/*private oauthService: OAuthService,*/ private router: Router) {
    this.configureSingleSignOn();
   }

  ngOnInit() {
  }

  configureSingleSignOn() {
    /*
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    */
  }

  login(){
    //this.oauthService.initImplicitFlow();
    this.router.navigateByUrl("home");
  }

  get token(){
    //let claims:any = this.oauthService.getIdentityClaims();
    //return claims ? claims : null;
    return true;
  }

}
