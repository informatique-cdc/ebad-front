import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Table} from '../shared/table/table.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {UsersService} from '../core/services';
import {ModalUserComponent} from './modal-user/modal-user.component';
import {User} from '../core/models';
import {ModalRolesComponent} from "./modal-roles/modal-roles.component";
import {environment} from "../../environments/environment";
import {Pageable} from "../core/models/pageable.model";
import {Constants} from "../shared/Constants";
import {fromEvent} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, tap} from "rxjs/operators";

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  @ViewChild('input') input: ElementRef;

  table: Table;
  jwt = environment.jwt;
  pageSize = this.constants.numberByPage;

  pagination = {
    itemsPerPage: this.pageSize,
    currentPage: 0,
    totalItems: 0
  };
  peoplesPage = {
    to: 0,
    from: 0,
    of: 0
  };

  users: User[] = [];

  constructor(private usersService: UsersService,
              private modalService: NgbModal,
              private notifierService: NotifierService,
              private constants: Constants) {

  }

  ngOnInit() {
    this.changePage(1);
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement,'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap((text) => {
          let pageable : any = new Pageable(0, this.pageSize);
          pageable.login = this.input.nativeElement.value;
          this.refreshUsers(pageable);
        })
      )
      .subscribe();
  }

  changePage(event){
    this.refreshUsers(new Pageable(event-1,this.pageSize));
  }

  refreshUsers(pageable: any = new Pageable(0, this.pageSize)) {
    this.usersService.getAll(pageable).subscribe(
      users => {
        this.pagination.currentPage = users.number + 1;
        this.pagination.itemsPerPage = users.size;
        this.pagination.totalItems = users.totalElements;
        this.users = users.content;
        this.peoplesPage.from = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
        this.peoplesPage.to = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + this.pagination.itemsPerPage;
        this.peoplesPage.of = this.pagination.totalItems;
        if(this.peoplesPage.to > this.peoplesPage.of){
          this.peoplesPage.to = this.peoplesPage.of;
        }
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
