import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from '../service/user.service';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private userService: UserService) { }

  canActivate(): Observable<boolean> {
    return this.isUserLoggedInAsAdmin();
  }

  isUserLoggedInAsAdmin(): Observable<boolean> {
    return this.userService.isUserLoggedInAsAdmin()
      .pipe(tof => {
        return tof;
      });
  }

}
