import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  canActivate() {
    console.log("AdminGuardGuard");
    return true;
  }

}
