import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileKind} from '../../core/models/file-kind.model';

@Component({
  selector: 'app-modal-naming-deletion',
  templateUrl: './modal-naming-deletion.component.html'
})
export class ModalNamingDeletionComponent implements OnInit {
  fileKind: FileKind;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
