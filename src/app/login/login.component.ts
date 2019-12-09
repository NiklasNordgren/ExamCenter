import { Component, OnInit } from '@angular/core';
//import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
//import { authConfig } from '../sso.config';
import { Router } from '@angular/router';
import {FormBuilder} from '@angular/forms';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private checkoutForm;

  //TODO: Remove router when SSO is implemented
  constructor(private formBuilder: FormBuilder/*private oauthService: OAuthService,private router: Router*/, private loginService: LoginService) {
    this.checkoutForm = this.formBuilder.group({
      email: '',
      password: ''
    });
    
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
  onSubmit(){

  }

  login(loginData){
    console.log(loginData);
    this.loginService.login(loginData);
    console.warn("hello u made it LOGIN METHOD");
    //this.oauthService.initImplicitFlow();
    //this.router.navigateByUrl("home");
  }

  get token(){
    //let claims:any = this.oauthService.getIdentityClaims();
    //return claims ? claims : null;
    return true;
  }

}
