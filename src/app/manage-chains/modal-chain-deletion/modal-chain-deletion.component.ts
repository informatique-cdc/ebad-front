import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Chain} from '../../core';

@Component({
  selector: 'app-modal-chain-deletion',
  templateUrl: './modal-chain-deletion.component.html'
})
export class ModalChainDeletionComponent implements OnInit {
  chain: Chain;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
