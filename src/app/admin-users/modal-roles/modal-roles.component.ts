import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UsersService, Roles} from '../../core';

@Component({
  selector: 'app-modal-roles',
  templateUrl: './modal-roles.component.html'
})
export class ModalRolesComponent {
  isUpdate = false;
  title = 'Modifier les rôles d\'un utilisateur';
  action = 'Modifier';
  roles: Roles = {
    loginUser: undefined,
    roleAdmin: false,
    roleUser: false
  };

  constructor(public activeModal: NgbActiveModal,
              private usersService: UsersService) {
  }

  changeRoles() {
    this.usersService.updateRoles(this.roles).subscribe(
      user => {
        this.activeModal.close(user);
      },
      error => {
        this.activeModal.dismiss(error);
      }
    );
  }
}
