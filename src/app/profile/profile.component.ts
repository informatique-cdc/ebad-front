import {Component, OnInit} from '@angular/core';
import {User, UserService} from '../core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: []
})
export class ProfileComponent implements OnInit{
  user: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    console.log(this.user);
  }
}

