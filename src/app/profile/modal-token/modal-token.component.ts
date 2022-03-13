import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiToken} from '../../core';
import {ApiTokensService} from '../../core/services/api-tokens.service';

@Component({
  selector: 'app-modal-token',
  templateUrl: './modal-token.component.html'
})
export class ModalTokenComponent {
  token: ApiToken = {
    id: undefined,
    name: undefined,
    createdDate: undefined,
    token: undefined,
    lastModifiedBy: undefined,
    lastModifiedDate: undefined,
    createdBy: undefined
  };

  constructor(public activeModal: NgbActiveModal, private apiTokensService: ApiTokensService) {
  }

  addToken() {
      this.apiTokensService.addApiToken(this.token).subscribe(
        fileKind => {
          this.activeModal.close(fileKind);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );

  }
}
