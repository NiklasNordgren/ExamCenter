import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { shareReplay, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AcademyService } from '../service/academy.service';
import { Academy } from '../model/academy.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  academies: Academy[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private academyService: AcademyService) { }

  ngOnInit() {

    this.academyService.getAllAcademies().subscribe(academies => {
      this.academies = academies;
    });

  }

  logout() {
    // this.oauthService.logout();
    this.router.navigateByUrl('login');
  }

}
