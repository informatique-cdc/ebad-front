import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Norme} from '../../core/models';

@Component({
  selector: 'app-modal-norm-deletion',
  templateUrl: './modal-norm-deletion.component.html'
})
export class ModalNormDeletionComponent implements OnInit {
  norm: Norme;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
