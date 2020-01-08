import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../service/user.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.isUserLoggedInAsAdmin(state);
  }

  isUserLoggedInAsAdmin(state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.isUserLoggedInAsAdmin()
      .pipe(tof => {
        if (!tof)
          this.router.navigateByUrl('/academy');
        return tof;
      });
  }

}
