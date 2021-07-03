import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiToken} from '../../core';
import {ApiTokensService} from '../../core/services/api-tokens.service';

@Component({
  selector: 'app-token-naming-deletion',
  templateUrl: './modal-token-deletion.component.html'
})
export class ModalTokenDeletionComponent {
  token: ApiToken;

  constructor(public activeModal: NgbActiveModal, private apiTokensService: ApiTokensService) {
  }

  deleteToken() {
    this.apiTokensService.deleteApiToken(this.token.id).subscribe(
      fileKind => {
        this.activeModal.close(fileKind);
      },
      error => {
        this.activeModal.dismiss(error);
      }
    );
  }

}
