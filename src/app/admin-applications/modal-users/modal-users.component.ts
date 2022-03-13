import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Application, User} from '../../core';
import {UsersService} from '../../core';
import {Observable} from 'rxjs';
import {UserApplication} from '../../core/models/user-application.model';
import {Pageable} from '../../core/models/pageable.model';
import { debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';

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


  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(
        (searchText) => {
          const pageable: any = new Pageable(0, 20);
          pageable.login = searchText;
          return this.usersService.getAll(pageable).pipe(
            map(results => results.content)
          );
        }),
    );
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

  formatter = (user) => `${user.firstName} ${user.lastName} (${user.login})`;
}
