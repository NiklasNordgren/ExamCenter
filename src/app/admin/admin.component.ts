import { Component, OnInit } from '@angular/core';
import { faUserPlus, faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../service/user.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: User[] = [];

  faUserPlus = faUserPlus;
  faCog = faCog;
  faSearch = faSearch;

  constructor(private userService: UserService) { }

  ngOnInit() { 
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      console.log(users);
    });
  }

}
