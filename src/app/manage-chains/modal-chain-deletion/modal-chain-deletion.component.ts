import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Chain} from '../../core';

@Component({
  selector: 'app-modal-chain-deletion',
  templateUrl: './modal-chain-deletion.component.html'
})
export class ModalChainDeletionComponent {
  chain: Chain;

  constructor(public activeModal: NgbActiveModal) {
  }

}
