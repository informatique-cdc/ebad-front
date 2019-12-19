import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-run-with-parameters',
  templateUrl: './modal-run-with-parameters.component.html'
})
export class ModalRunWithParametersComponent implements OnInit {

  parameters: string;
  batchName: string
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
