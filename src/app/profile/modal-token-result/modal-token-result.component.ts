import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiToken} from '../../core';

@Component({
  selector: 'app-modal-token-result',
  templateUrl: './modal-token-result.component.html'
})
export class ModalTokenResultComponent {
  token: ApiToken;

  constructor(public activeModal: NgbActiveModal) {
  }
}
