import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Application, User} from '../../core/models';
import {UsersService} from '../../core/services';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {UserApplication} from '../../core/models/user-application.model';

@Component({
  selector: 'app-modal-users',
  templateUrl: './modal-users.component.html'
})
export class ModalUsersComponent implements OnInit {
  application: Application;
  title = `Gestion des utilisateurs`;
  action = 'Terminer';
  isModerator = false;
  usersApplication: User[] = [];
  user: User;
  listUsers: User[];

  constructor(public activeModal: NgbActiveModal,
              private usersService: UsersService) {
  }

  ngOnInit() {
    if (this.isModerator) {
      this.title = `Gestion des modérateurs`;
    }
    this.usersService.getAll().subscribe(users => this.listUsers = users.content);
  }

  addUser() {
    if (!this.user || !this.user.login) {
      return;
    }

    const userApplication: UserApplication = {
      addModo: this.isModerator,
      addUser: !this.isModerator,
      idApplication: this.application.id,
      loginUser: this.user.login,
      removeModo: false,
      removeUser: false
    };

    this.usersService.updateAccessApplication(userApplication).subscribe(
      () => {
        this.usersApplication.push(this.user);
        this.user = undefined;
      }
    );
  }

  deleteUser(user: User) {
    console.log(user);
    const userApplication: UserApplication = {
      addModo: false,
      addUser: false,
      idApplication: this.application.id,
      loginUser: user.login,
      removeModo: this.isModerator,
      removeUser: !this.isModerator
    };

    this.usersService.updateAccessApplication(userApplication).subscribe(
      () => {
        const index = this.usersApplication.indexOf(user);
        this.usersApplication.splice(index, 1);
      }
    );

  }


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.listUsers.filter(v =>
          (v.login.toLowerCase().startsWith(term.toLocaleLowerCase()) && !this.usersApplication.some(e => e.login === v.login))
        ).splice(0, 10))
    );

  formatter = (user) => `${user.firstName} ${user.lastName} (${user.login})`;
}
