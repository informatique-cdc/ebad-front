import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Environment} from '../../core/models';

@Component({
  selector: 'app-modal-environment-deletion',
  templateUrl: './modal-environment-deletion.component.html'
})
export class ModalEnvironmentDeletionComponent implements OnInit {
  environment: Environment;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
