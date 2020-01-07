import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

	constructor(private http: HttpClient) { }

	getAllUsers() {
		return this.http.get<User[]>("api/users/all");
    }

    getUserById(id: number) {
        return this.http.get<User>('api/users/' + id);
    }
  
    saveUser(user: User): Observable<User> {
        return this.http.post<User>("/api/users", user);
    }

    deleteUser(id: number) {
        return this.http.delete('/api/users/' + id).subscribe(data => {
        });;
    }

}