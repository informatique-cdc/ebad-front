import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UsersService, User} from '../../core';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html'
})
export class ModalUserComponent implements OnInit {
  isUpdate = false;
  title = 'Ajouter un utilisateur';
  action = 'Ajouter';
  user: User = {
    id: undefined,
    firstName: undefined,
    lastName: undefined,
    login: undefined,
    authorities: [],
    token: undefined,
    email: undefined,
    activated: false,
    activationKey: undefined,
    langKey: 'fr',
    roles: [],
    password: undefined,
    createdBy: undefined,
    createdDate: undefined,
    lastModifiedBy: undefined,
    lastModifiedDate: undefined,
    usageApplications: []
  };

  constructor(public activeModal: NgbActiveModal,
              private usersService: UsersService) {
  }

  ngOnInit() {
    if (this.isUpdate) {
      this.title = `Modifier l'utilisateur ${this.user.firstName} ${this.user.lastName} (${this.user.login})`;
      this.action = `Modifier`;
    }
  }

  addUser() {
    if (!this.isUpdate) {
      this.usersService.addUser(this.user).subscribe(
        user => {
          this.activeModal.close(user);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    } else {
      this.usersService.updateUser(this.user).subscribe(
        user => {
          this.activeModal.close(user);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    }
  }
}
