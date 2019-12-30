import {Component, OnInit} from '@angular/core';
import {Table} from '../shared/table/table.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {UsersService} from '../core/services';
import {ModalUserComponent} from './modal-user/modal-user.component';
import {User} from '../core/models';
import {ModalRolesComponent} from "./modal-roles/modal-roles.component";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  table: Table;
  jwt = environment.jwt;
  private idActionModify = 'actionModify';
  private idActionActivate = 'ActionActivate';
  private idActionInctivate = 'ActionInctivate';

  users: User[] = [];

  constructor(private usersService: UsersService,
              private modalService: NgbModal,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
    this.refreshUsers();
  }

  refreshUsers() {
    this.usersService.getAll().subscribe(
      users => {
        this.users = users;
      }
    );
  }

  onClickAddUser() {
    const modalRef = this.modalService.open(ModalUserComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `L'utilisateur ${result.login} a bien été ajouté`);
      this.refreshUsers();
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ahout de l'utilisateur : ${reason.message}`);
      }
    });
    modalRef.componentInstance.isUpdate = false;
  }

  onClickChangeRole(user: User) {
    const modalRef = this.modalService.open(ModalRolesComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `L'utilisateur ${result.login} a bien été modifié`);
      this.refreshUsers();
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de la modification de l'utilisateur : ${reason.message}`);
      }
    });
    modalRef.componentInstance.roles.loginUser = user.login;
    modalRef.componentInstance.roles.roleAdmin = user.authorities.find(function (obj: any) {
      return obj.name === "ROLE_ADMIN";
    }) != undefined;
    modalRef.componentInstance.roles.roleUser = user.authorities.find(function (obj: any) {
      return obj.name === "ROLE_USER";
    }) != undefined;
  }

  onClickModifyUser(user: User) {
    const modalRef = this.modalService.open(ModalUserComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `L'utilisateur ${result.login} a bien été modifié`);
      this.refreshUsers();
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de la modification de l'utilisateur : ${reason.message}`);
      }
    });
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.isUpdate = true;
  }

  onClickActivateUser(user: User) {
    this.usersService.activateUser(user.activationKey).subscribe(
      () => {
        this.notifierService.notify('success', `L\'utilisateur a bien été activé`);
        this.users[this.users.indexOf(user)].activated = true;
      },
      (reason) => {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'activation de l'utilisateur : ${reason.message}`);
      }
    );
  }

  onClickInactivateUser(user: User) {
    this.usersService.inactivateUser(user.login).subscribe(
      (thisUser) => {
        this.notifierService.notify('success', `L\'utilisateur ${thisUser.login} a bien été désactivé`);
        this.users[this.users.indexOf(user)].activated = false;
      },
      (reason) => {
        this.notifierService.notify('error', `Une erreur est survenue lors de la désactivation de l'utilisateur : ${reason.message}`);
      }
    );
  }
}
