import { Component } from '@angular/core';
// import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
// import { authConfig } from './sso.config';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { AcademyService } from 'src/app/service/academy.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'testApp';
  private academies = [];

  constructor(private breakpointObserver: BreakpointObserver, private service: AcademyService, private router: Router) { 
    
  }

  ngOnInit(){
      this.service.getAllAcademies().subscribe(responseAcademies => {
        this.convertAndSetAcademies(responseAcademies);
        console.log(this.academies);
    });
    
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    convertAndSetAcademies(responseAcademies){
      this.academies = [];
      responseAcademies.forEach(academy => {
        this.academies.push({
          name: academy['name'],
          shortDesc: academy['abbreviation'],
          id: academy['id']
        });
      });
    }
    goToPage(pageName:string){
      this.router.navigate([`${pageName}`]);
    }

}



