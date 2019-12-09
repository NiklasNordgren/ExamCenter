import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { variable } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(loginData: any){
    console.log("Trying to login, in LoginService...");
    
    const data = {'email': "sanna", 'password': "password"};
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    const kafn = this.http.post<any>("/api/login", JSON.stringify(data), config);
    debugger;
    return kafn;
  }

}
