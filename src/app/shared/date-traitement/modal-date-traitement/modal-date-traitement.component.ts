import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-date-traitement',
  templateUrl: './modal-date-traitement.component.html',
  styleUrls: ['./modal-date-traitement.component.scss']
})
export class ModalDateTraitementComponent implements OnInit {

  dateTraitement: NgbDate;

  constructor(public activeModal: NgbActiveModal, private ngbDateParserFormatter: NgbDateParserFormatter ) {
  }

  ngOnInit() {
  }

  sendDateTraitement() {
    const dateStrFr = this.ngbDateParserFormatter.format(this.dateTraitement);
    const dateParts = dateStrFr.trim().split('/');
    const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    this.activeModal.close(date);
  }
}
