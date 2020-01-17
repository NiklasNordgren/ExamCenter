import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginStateShareService {
  private loginStateSource = new BehaviorSubject(false);
  currentLoginState = this.loginStateSource.asObservable();

  constructor() { }

  changeLoginState(loginState: boolean) {
    this.loginStateSource.next(loginState)
  }
}