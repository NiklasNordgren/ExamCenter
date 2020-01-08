import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class SuperGuard implements CanActivate {

  constructor(private userService: UserService) { }

  canActivate(): Observable<boolean>{
    return this.isUserLoggedInAsSuperUser();
  }

  isUserLoggedInAsSuperUser(): Observable<boolean> {
    return this.userService.isUserLoggedInAsAdmin()
      .pipe(tof => {
        console.log(tof);
        return tof;
      });
  }



}
