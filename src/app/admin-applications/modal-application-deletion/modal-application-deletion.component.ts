import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Application} from '../../core/models';

@Component({
  selector: 'app-modal-application-deletion',
  templateUrl: './modal-application-deletion.component.html'
})
export class ModalApplicationDeletionComponent implements OnInit {
  application: Application;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
