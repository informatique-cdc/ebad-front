import {Component, OnInit} from '@angular/core';
import {ApiToken, User, UserService} from '../core';
import {ModalNamingComponent} from "../manage-naming/modal-naming/modal-naming.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastService} from "../core/services/toast.service";
import {ModalTokenComponent} from "./modal-token/modal-token.component";
import {ModalTokenDeletionComponent} from "./modal-token-deletion/modal-token-deletion.component";
import {TranslateService} from "@ngx-translate/core";
import {ApiTokensService} from "../core/services/api-tokens.service";
import {Pageable} from "../core/models/pageable.model";
import {ModalTokenResultComponent} from "./modal-token-result/modal-token-result.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: []
})
export class ProfileComponent implements OnInit {
  user: User;
  tokens: ApiToken[] = [];

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private apiTokensService: ApiTokensService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.refreshTokensList();
  }

  refreshTokensList() {
    this.apiTokensService.getAll(new Pageable(0, 1000)).subscribe(value => this.tokens = value.content);
  }

  onClickDelete(token: ApiToken) {
    const modalRef = this.modalService.open(ModalTokenDeletionComponent);
    modalRef.result.then((result) => {
      this.translateService.get('PROFILE.SECURITY.DELETE_API_TOKEN_SUCCESS')
        .subscribe((msg) => this.toastService.showSuccess(msg));
      this.refreshTokensList();
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.translateService.get('PROFILE.SECURITY.DELETE_API_TOKEN_ERROR', {msg: reason.apierror.message})
          .subscribe((msg) => this.toastService.showError(msg));
      }
    });
    modalRef.componentInstance.token = {...token};

  }

  onClickNewToken() {
    const modalRef = this.modalService.open(ModalTokenComponent);
    modalRef.result.then((result) => {
      this.translateService.get('PROFILE.SECURITY.NEW_API_TOKEN_SUCCESS')
        .subscribe((msg) => this.toastService.showSuccess(msg));
      const modalRefToken = this.modalService.open(ModalTokenResultComponent);
      modalRefToken.componentInstance.token = result;
      this.refreshTokensList();
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.translateService.get('PROFILE.SECURITY.NEW_API_TOKEN_ERROR', {msg: reason.apierror.message})
          .subscribe((msg) => this.toastService.showError(msg));
      }
    });
  }
}

